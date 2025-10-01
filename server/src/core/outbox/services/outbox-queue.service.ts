// core/outbox/services/outbox-queue.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { OutboxMessageDAO } from "../daos/outbox-message.dao";
import {
  OutboxMessageType,
  OutboxMessageStatus,
  ProcessorStatus,
} from "../model/outbox-message.schema";
import { LoggerService } from "../../logger/services/logger.service";
import { UserContext } from "../../contexts/user.context";
import { DistributedLockService } from "../../service/distributed-lock.service";
import { TransactionContext } from "../../contexts/transaction.context";

@Injectable()
export class OutboxQueueService implements OnModuleInit {
  private isProcessing = false;
  private logger: any;

  constructor(
    @InjectQueue("email-processor") private emailQueue: Queue,
    @InjectQueue("s3-upload-processor") private s3Queue: Queue,
    @InjectQueue("rabbitmq-processor") private rabbitMqQueue: Queue,
    @InjectQueue("bull-task-processor") private bullTaskQueue: Queue,

    // Queues for domain event processors
    @InjectQueue("notification-processor") private notificationQueue: Queue,
    @InjectQueue("ai-processor") private aiQueue: Queue,
    @InjectQueue("audit-log-processor") private auditLogQueue: Queue,

    @InjectConnection() private readonly connection: Connection,
    private readonly outboxMessageDAO: OutboxMessageDAO,
    private readonly distributedLockService: DistributedLockService,
    loggerService: LoggerService
  ) {
    this.logger = loggerService.forContext("OutboxQueueService");
  }

  async onModuleInit() {
    // Nothing specific to do on init
  }

  // Helper to run with system user context
  private async withSystemContext(fn: () => Promise<any>) {
    // Create a system user context for background operations
    const systemContext = {
      userId: "system",
      roles: ["SYSTEM"],
      permissions: ["*"],
      isProductAdmin: true,
    };

    // Run with system context
    return await UserContext.getInstance().run(systemContext, fn);
  }

  // Select the appropriate queue based on message type
  private getQueueForMessageType(type: OutboxMessageType): Queue {
    switch (type) {
      case OutboxMessageType.EMAIL:
        return this.emailQueue;
      case OutboxMessageType.S3_UPLOAD:
        return this.s3Queue;
      case OutboxMessageType.RABBITMQ_MESSAGE:
        return this.rabbitMqQueue;
      case OutboxMessageType.BULL_TASK:
        return this.bullTaskQueue;
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  }

  // Get appropriate queue for processor type
  private getQueueForProcessor(processorType: string): Queue | null {
    switch (processorType) {
      case "notification":
        return this.notificationQueue;
      case "ai":
        return this.aiQueue;
      case "audit-log":
        return this.auditLogQueue;
      // Add more processor types as needed
      default:
        return null;
    }
  }

  /**
   * Phase 1 of the saga: Mark message as preparing in a transaction
   */
  private async lockMessageInTransaction(messageId: string): Promise<boolean> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      // Run in transaction context for proper session propagation
      await TransactionContext.getInstance().run(session, async () => {
        await this.outboxMessageDAO.update(messageId, {
          status: OutboxMessageStatus.PENDING, // Still PENDING but locked
          locked: true,
          lockExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minute lock
        });
      });

      await session.commitTransaction();
      this.logger.debug(`[Phase 1] Message ${messageId} locked successfully`);
      return true;
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(`[Phase 1] Failed to lock message ${messageId}`, error);
      return false;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Phase 2 of the saga: Add message to queue (non-transactional)
   */
  private async queueMessageInSystem(
    messageId: string,
    type: OutboxMessageType,
    priority: number = 0
  ): Promise<string | null> {
    try {
      const queue = this.getQueueForMessageType(type);

      const job = await queue.add(
        "process",
        {
          messageId,
        },
        {
          attempts: 1, // We handle retries at the outbox level
          removeOnComplete: true,
          removeOnFail: true,
          priority,
        }
      );

      const jobId = job.id.toString();
      this.logger.debug(
        `[Phase 2] Message ${messageId} queued with job ID ${jobId}`
      );
      return jobId;
    } catch (error) {
      this.logger.error(
        `[Phase 2] Failed to queue message ${messageId}`,
        error
      );
      return null;
    }
  }

  /**
   * Phase 3 of the saga: Update message with job ID and status in a transaction
   */
  private async updateMessageWithJobId(
    messageId: string,
    jobId: string
  ): Promise<boolean> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      await TransactionContext.getInstance().run(session, async () => {
        await this.outboxMessageDAO.update(messageId, {
          jobId,
          status: OutboxMessageStatus.PROCESSING,
        });
      });

      await session.commitTransaction();
      this.logger.debug(
        `[Phase 3] Message ${messageId} updated with job ID ${jobId}`
      );
      return true;
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(
        `[Phase 3] Failed to update message ${messageId} with job ID`,
        error
      );
      return false;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Compensating action: Unlock message if queueing fails
   */
  private async unlockMessage(messageId: string): Promise<boolean> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      await TransactionContext.getInstance().run(session, async () => {
        await this.outboxMessageDAO.update(messageId, {
          locked: false,
          lockExpiresAt: null,
        });
      });

      await session.commitTransaction();
      this.logger.debug(
        `[Compensating] Message ${messageId} unlocked after queueing failure`
      );
      return true;
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(
        `[Compensating] Failed to unlock message ${messageId}`,
        error
      );
      return false;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Compensating action: Try to remove job from queue if DB update fails
   */
  private async removeJobFromQueue(
    type: OutboxMessageType,
    jobId: string
  ): Promise<boolean> {
    try {
      const queue = this.getQueueForMessageType(type);
      await queue.removeJobs(jobId);
      this.logger.debug(
        `[Compensating] Removed job ${jobId} from queue after DB update failure`
      );
      return true;
    } catch (error) {
      this.logger.error(
        `[Compensating] Failed to remove job ${jobId} from queue`,
        error
      );
      return false;
    }
  }

  /**
   * Process a single outbox message using the saga pattern
   */
  private async processOutboxMessage(message: any): Promise<boolean> {
    this.logger.debug(
      `Starting saga for message ${message.id} of type ${message.type}`
    );

    // Phase 1: Lock the message
    const lockSuccess = await this.lockMessageInTransaction(message.id);
    if (!lockSuccess) {
      return false;
    }

    // Phase 2: Queue the message
    const jobId = await this.queueMessageInSystem(
      message.id,
      message.type,
      message.priority
    );
    if (!jobId) {
      // Compensating action for Phase 1
      await this.unlockMessage(message.id);
      return false;
    }

    // Phase 3: Update message with job ID
    const updateSuccess = await this.updateMessageWithJobId(message.id, jobId);
    if (!updateSuccess) {
      // Compensating action for Phase 2
      await this.removeJobFromQueue(message.type, jobId);
      // Compensating action for Phase 1
      await this.unlockMessage(message.id);
      return false;
    }

    this.logger.debug(`Completed saga for message ${message.id} successfully`);
    return true;
  }

  // Public method to trigger immediate processing
  async triggerProcessing(): Promise<number> {
    return await this.queuePendingMessages();
  }

  // Main processing method
  @Cron(CronExpression.EVERY_5_SECONDS)
  async queuePendingMessages(): Promise<number> {
    // Prevent concurrent processing
    if (this.isProcessing) {
      return 0;
    }

    // Use system context for this background operation
    return await this.withSystemContext(async () => {
      // Quick check if there are any messages to process
      const hasPending = await this.outboxMessageDAO.hasPendingMessages();
      if (!hasPending) {
        return 0;
      }

      // Try to acquire a distributed lock
      const lockAcquired = await this.distributedLockService.acquire(
        "outbox-processor",
        30000
      );
      if (!lockAcquired) {
        return 0; // Another instance is processing
      }

      try {
        this.isProcessing = true;

        // Find pending messages
        const messages = await this.outboxMessageDAO.findPendingMessages(50);
        if (messages.length === 0) {
          return 0;
        }

        this.logger.info(`Processing ${messages.length} outbox messages`);

        let queuedCount = 0;
        // Process each message individually to isolate failures
        // Process each message
        for (const message of messages) {
          try {
            if (
              message.type === OutboxMessageType.DOMAIN_EVENT &&
              message.processors?.length > 0
            ) {
              // Domain event with processors
              const queuedForMessage = await this.processDomainEvent(message);
              queuedCount += queuedForMessage;
            } else {
              // Regular outbox message (original logic)
              const success = await this.processOutboxMessage(message);
              if (success) {
                queuedCount++;
              }
            }
          } catch (error) {
            this.logger.error(`Failed to process message ${message.id}`, error);
          }
        }

        this.logger.info(`Successfully queued ${queuedCount} outbox messages`);
        return queuedCount;
      } finally {
        this.isProcessing = false;
        await this.distributedLockService.release("outbox-processor");
      }
    });
  }

  private async processDomainEvent(message: any): Promise<number> {
    let queuedCount = 0;

    for (const processor of message.processors) {
      if (
        processor.status !== ProcessorStatus.PENDING ||
        processor.locked === true
      ) {
        continue;
      }

      // Phase 1: Mark processor as preparing (with transaction)
      const lockSuccess = await this.lockProcessor(
        message.id,
        processor.processorType
      );
      if (!lockSuccess) continue;

      // Phase 2: Queue the job (non-transactional)
      const jobId = await this.queueProcessor(
        message.id,
        processor.processorType,
        message.eventType
      );
      if (!jobId) {
        // Compensating action: Reset processor if queuing fails
        await this.resetProcessor(message.id, processor.processorType);
        continue;
      }

      // Phase 3: Update processor with job ID (with transaction)
      const updateSuccess = await this.updateProcessorWithJobId(
        message.id,
        processor.processorType,
        jobId
      );
      if (!updateSuccess) {
        // Compensating action: Remove job from queue if update fails
        await this.removeJobFromProcessorQueue(processor.processorType, jobId);
        await this.resetProcessor(message.id, processor.processorType);
        continue;
      }

      queuedCount++;
    }

    return queuedCount;
  }

  /**
   * Phase 1: Lock processor in transaction
   */
  /**
   * Phase 1: Lock processor in transaction
   */
  private async lockProcessor(
    messageId: string,
    processorType: string
  ): Promise<boolean> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      // Run in transaction context for proper session propagation
      await TransactionContext.getInstance().run(session, async () => {
        // First, verify the processor is still in PENDING state and not being processed
        const message = await this.outboxMessageDAO.findById(messageId);
        const processor = message?.processors?.find(
          (p) => p.processorType === processorType
        );

        if (!processor || processor.status !== ProcessorStatus.PENDING) {
          throw new Error(
            `Processor ${processorType} for message ${messageId} is not in PENDING state`
          );
        }

        // Update the processor to indicate it's locked for processing
        await this.outboxMessageDAO.updateProcessorStatus(
          messageId,
          processorType,
          ProcessorStatus.PENDING, // Status remains PENDING
          {
            lastAttempt: new Date(),
            locked: true, // Add a locked flag
            lockExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minute lock
          }
        );
      });

      await session.commitTransaction();
      this.logger.debug(
        `[Phase 1] Processor ${processorType} for message ${messageId} locked successfully`
      );
      return true;
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(
        `[Phase 1] Failed to lock processor ${processorType} for message ${messageId}`,
        error
      );
      return false;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Phase 2: Queue processor job (non-transactional)
   */
  private async queueProcessor(
    messageId: string,
    processorType: string,
    eventType: string,
    priority: number = 0
  ): Promise<string | null> {
    try {
      const queue = this.getQueueForProcessor(processorType);

      if (!queue) {
        this.logger.warn(
          `No queue configured for processor type: ${processorType}`
        );
        return null;
      }

      const job = await queue.add(
        "process",
        {
          messageId,
          processorType,
          eventType,
        },
        {
          attempts: 1, // We handle retries at the processor level
          removeOnComplete: true,
          removeOnFail: true,
          priority,
        }
      );

      const jobId = job.id.toString();
      this.logger.debug(
        `[Phase 2] Processor ${processorType} for message ${messageId} queued with job ID ${jobId}`
      );
      return jobId;
    } catch (error) {
      this.logger.error(
        `[Phase 2] Failed to queue processor ${processorType} for message ${messageId}`,
        error
      );
      return null;
    }
  }

  /**
   * Phase 3: Update processor with job ID in transaction
   */
  private async updateProcessorWithJobId(
    messageId: string,
    processorType: string,
    jobId: string
  ): Promise<boolean> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      await TransactionContext.getInstance().run(session, async () => {
        await this.outboxMessageDAO.updateProcessorStatus(
          messageId,
          processorType,
          ProcessorStatus.PROCESSING,
          {
            jobId,
            lastAttempt: new Date(),
            locked: false, // Release the lock when moving to PROCESSING
            lockExpiresAt: null,
          }
        );
      });

      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      return false;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Compensating action: Reset processor if a step fails
   */
  private async resetProcessor(
    messageId: string,
    processorType: string
  ): Promise<boolean> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      await TransactionContext.getInstance().run(session, async () => {
        await this.outboxMessageDAO.updateProcessorStatus(
          messageId,
          processorType,
          ProcessorStatus.PENDING,
          {
            jobId: null,
            lastAttempt: new Date(),
            locked: false, // Release the lock when resetting
            lockExpiresAt: null,
          }
        );
      });

      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      return false;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Compensating action: Remove job from queue if database update fails
   */
  private async removeJobFromProcessorQueue(
    processorType: string,
    jobId: string
  ): Promise<boolean> {
    try {
      const queue = this.getQueueForProcessor(processorType);

      if (!queue) {
        this.logger.warn(`No queue found for processor type: ${processorType}`);
        return false;
      }

      await queue.removeJobs(jobId);
      this.logger.debug(
        `[Compensating] Removed job ${jobId} from ${processorType} queue after DB update failure`
      );
      return true;
    } catch (error) {
      this.logger.error(
        `[Compensating] Failed to remove job ${jobId} from ${processorType} queue`,
        error
      );
      return false;
    }
  }

  /**
   * Monitor for stuck processors
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async checkStuckProcessors(): Promise<void> {
    await this.withSystemContext(async () => {
      try {
        // Acquire distributed lock
        const lockAcquired = await this.distributedLockService.acquire(
          "stuck-processor-check",
          30000
        );
        if (!lockAcquired) {
          return; // Another instance is handling this
        }

        try {
          // Define cutoff time (e.g., 30 minutes ago)
          const cutoffTime = new Date();
          cutoffTime.setMinutes(cutoffTime.getMinutes() - 30);

          // Find domain events with processors in PROCESSING state for too long
          const messages = await this.outboxMessageDAO.find({
            type: OutboxMessageType.DOMAIN_EVENT,
            "processors.status": ProcessorStatus.PROCESSING,
            "processors.lastAttempt": { $lt: cutoffTime },
            "processors.locked": false, // Not currently being processed by the saga
          });

          if (messages.length === 0) {
            return;
          }

          this.logger.warn(
            `Found ${messages.length} domain events with stuck processors`
          );

          let resetCount = 0;

          // Process each message
          for (const message of messages) {
            // Find stuck processors
            const stuckProcessors = message.processors.filter(
              (p) =>
                p.status === ProcessorStatus.PROCESSING &&
                p.lastAttempt &&
                p.lastAttempt < cutoffTime &&
                !p.locked
            );

            // Reset each stuck processor
            for (const processor of stuckProcessors) {
              try {
                // Mark as failed to trigger retry mechanism
                await this.outboxMessageDAO.updateProcessorStatus(
                  message.id,
                  processor.processorType,
                  ProcessorStatus.FAILED,
                  {
                    error: "Processor stuck in PROCESSING state",
                    lastAttempt: new Date(),
                    jobId: null, // Clear job ID to allow re-queuing
                    locked: false,
                    lockExpiresAt: null,
                  }
                );

                resetCount++;
              } catch (error) {
                this.logger.error(
                  `Error resetting stuck processor: ${processor.processorType}/${message.id}`,
                  error
                );
              }
            }
          }

          if (resetCount > 0) {
            this.logger.info(`Reset ${resetCount} stuck processors`);
          }
        } finally {
          await this.distributedLockService.release("stuck-processor-check");
        }
      } catch (error) {
        this.logger.error("Error checking for stuck processors", error);
      }
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async releaseStaleProcessorLocks(): Promise<void> {
    await this.withSystemContext(async () => {
      try {
        const lockAcquired = await this.distributedLockService.acquire(
          "processor-lock-release",
          30000
        );
        if (!lockAcquired) {
          return; // Another instance is handling lock release
        }
        const now = new Date();

        // Find domain events with locked processors where the lock has expired
        const messages = await this.outboxMessageDAO.find({
          type: OutboxMessageType.DOMAIN_EVENT,
          "processors.locked": true,
          "processors.lockExpiresAt": { $lt: now },
        });

        let releasedCount = 0;

        for (const message of messages) {
          for (const processor of message.processors) {
            if (
              processor.locked &&
              processor.lockExpiresAt &&
              processor.lockExpiresAt < now
            ) {
              // Release the lock
              await this.outboxMessageDAO.updateProcessorStatus(
                message.id,
                processor.processorType,
                ProcessorStatus.PENDING, // Reset to PENDING
                {
                  locked: false,
                  lockExpiresAt: null,
                  jobId: null, // Clear any job ID to allow re-queuing
                }
              );

              releasedCount++;
            }
          }
        }

        if (releasedCount > 0) {
          this.logger.info(`Released ${releasedCount} stale processor locks`);
        }
      } catch (error) {
        this.logger.error("Error releasing stale processor locks", error);
      } finally {
        await this.distributedLockService.release("processor-lock-release");
      }
    });
  }

  // Release stale locks
  @Cron(CronExpression.EVERY_MINUTE)
  async releaseStaleOutboxLocks() {
    await this.withSystemContext(async () => {
      // Acquire distributed lock
      const lockAcquired = await this.distributedLockService.acquire(
        "processor-lock-release-ob",
        30000
      );
      if (!lockAcquired) {
        return; // Another instance is handling lock release
      }
      try {
        const count = await this.outboxMessageDAO.releaseStaleLocks();
        if (count > 0) {
          this.logger.info(
            `Released ${count} stale locks from outbox messages`
          );
        }
      } catch (error) {
        this.logger.error("Error releasing stale locks", error);
      }finally {
        await this.distributedLockService.release('processor-lock-release-ob');
      }
    });
  }

  // Monitor for stuck jobs
  @Cron(CronExpression.EVERY_30_MINUTES)
  async checkStuckJobs() {
    await this.withSystemContext(async () => {
      // Acquire distributed lock
      const lockAcquired = await this.distributedLockService.acquire(
        "ob-stuck-message-lock-release",
        30000
      );
      if (!lockAcquired) {
        return; // Another instance is handling lock release
      }
      try {
        const stuckJobs = await this.outboxMessageDAO.findStuckJobs();
        if (stuckJobs.length > 0) {
          this.logger.warn(`Found ${stuckJobs.length} stuck jobs`);

          // Reset stuck jobs
          for (const job of stuckJobs) {
            await this.outboxMessageDAO.markAsFailed(
              job.id,
              "Job stuck in processing state"
            );
          }
        }
      } catch (error) {
        this.logger.error("Error checking for stuck jobs", error);
      } finally {
        await this.distributedLockService.release(
          "ob-stuck-message-lock-release"
        );
      }
    });
  }
}
