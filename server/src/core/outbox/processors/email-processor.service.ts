import { Injectable } from "@nestjs/common";
import { Processor, Process } from "@nestjs/bull";
import { Job } from "bull";
import { OutboxMessageDAO } from "../daos/outbox-message.dao";
import { LoggerService } from "../../logger/services/logger.service";
import { UserContext } from "../../contexts/user.context";
import { EmailService } from "../../../modules/email/mail.service";
import { createHash } from "crypto";
import { OutboxMessageStatus } from "../model/outbox-message.schema";

@Processor("email-processor")
export class EmailProcessorService {
  constructor(
    private readonly outboxMessageDAO: OutboxMessageDAO,
    private readonly emailService: EmailService,
    private readonly logger: LoggerService
  ) {}

  private async setupUserContext(message: any) {
    if (message.userContext) {
      // Use the original user's context if available
      return UserContext.getInstance().run(message.userContext, async () => {
        this.logger.debug(
          `Processing with user context: ${message.userContext.userId}`
        );
      });
    } else {
      // Fall back to system context if no user context is available
      const systemContext = {
        userId: "system",
        roles: ["SYSTEM"],
        permissions: ["*"],
        isProductAdmin: true,
      };

      return UserContext.getInstance().run(systemContext, async () => {
        this.logger.debug("Processing with system context");
      });
    }
  }

  @Process("process")
  async processEmail(job: Job<{ messageId: string }>) {
    const { messageId } = job.data;
    const message = await this.outboxMessageDAO.findById(messageId);

    // Enhanced error handling for saga edge cases
    if (!message) {
      this.logger.warn(
        `Email message not found: ${messageId} - job will be discarded`
      );
      return { skipped: true, reason: "message_not_found" };
    }

    // Check message status for saga consistency
    if (message.status !== OutboxMessageStatus.PROCESSING || !message.jobId) {
      this.logger.warn(
        `Email message ${messageId} is not in PROCESSING state or missing jobId - potential saga inconsistency`
      );

      // If message exists but is not in correct state, we should safely update it
      if (message.status === OutboxMessageStatus.PENDING) {
        await this.outboxMessageDAO.update(message.id, {
          status: OutboxMessageStatus.PROCESSING,
          jobId: job.id.toString(),
        });
        this.logger.info(
          `Updated message ${messageId} state for saga consistency`
        );
      } else if (message.status === OutboxMessageStatus.COMPLETED) {
        // If already completed, no need to process again
        this.logger.info(
          `Message ${messageId} already completed, skipping processing`
        );
        return { skipped: true, reason: "already_completed" };
      } else if (message.status === OutboxMessageStatus.FAILED) {
        // If failed but received for processing, we can retry
        await this.outboxMessageDAO.update(message.id, {
          status: OutboxMessageStatus.PROCESSING,
          jobId: job.id.toString(),
        });
        this.logger.info(`Retrying failed message ${messageId}`);
      }
    }

    // Restore user context
    await this.setupUserContext(message);

    try {
      const { to, subject, body, options } = message.payload;

      // Generate idempotency key for deduplication
      const idempotencyKey = createHash("md5")
        .update(`${to}-${subject}-${messageId}`)
        .digest("hex");

      // Check if we've seen this exact email before
      const emailLogExists =
        await this.emailService.checkIdempotencyKey(idempotencyKey);
      if (emailLogExists) {
        await this.outboxMessageDAO.markAsCompleted(messageId, {
          alreadySent: true,
          idempotencyKey,
        });
        return { alreadySent: true, idempotencyKey };
      }

      // Process based on whether this is a template or direct email
      let result;
      if (options?.template) {
        result = await this.emailService.sendTemplateEmail(
          options.template,
          to,
          typeof body === "string" ? JSON.parse(body) : body, // Template data
          { ...options, idempotencyKey }
        );
      } else {
        result = await this.emailService.sendEmail(to, subject, body, {
          ...options,
          idempotencyKey,
        });
      }

      // Mark as completed
      await this.outboxMessageDAO.markAsCompleted(messageId, result);

      return result;
    } catch (error) {
      this.logger.error(`Error processing email message ${messageId}`, error);
      await this.outboxMessageDAO.markAsFailed(messageId, error.message);
      throw error;
    }
  }
}