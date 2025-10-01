import { Injectable } from '@nestjs/common';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { OutboxMessageDAO } from '../daos/outbox-message.dao';
import { LoggerService } from '../../logger/services/logger.service';
import { UserContext } from '../../contexts/user.context';
// import { S3Service } from '../../storage/services/s3.service';
// import { GridFsService } from '../../storage/services/gridfs.service';
import { createHash } from 'crypto';

@Processor('s3-upload-processor')
export class S3ProcessorService {
  constructor(
    private readonly outboxMessageDAO: OutboxMessageDAO,
    // private readonly s3Service: S3Service,
    // private readonly gridFsService: GridFsService,
    private readonly logger: LoggerService
  ) {}
  
  private async setupUserContext(message: any) {
    if (message.userContext) {
      // Use the original user's context if available
      return UserContext.getInstance().run(message.userContext, async () => {
        this.logger.debug(`Processing with user context: ${message.userContext.userId}`);
      });
    } else {
      // Fall back to system context if no user context is available
      const systemContext = {
        userId: 'system',
        roles: ['SYSTEM'],
        permissions: ['*'],
        isProductAdmin: true
      };
      
      return UserContext.getInstance().run(systemContext, async () => {
        this.logger.debug('Processing with system context');
      });
    }
  }
  
  @Process('process')
  async processS3Upload(job: Job<{ messageId: string }>) {
    const { messageId } = job.data;
    const message = await this.outboxMessageDAO.findById(messageId);
    
    if (!message) {
      throw new Error(`S3 upload message not found: ${messageId}`);
    }
    
    // Restore user context
    await this.setupUserContext(message);
    
    try {
      const { key, fileId, contentType, metadata } = message.payload;
      
      // Generate idempotency key for deduplication
      const idempotencyKey = createHash('md5')
        .update(`${key}-${fileId}`)
        .digest('hex');
      
      // Check if already uploaded
      // const fileExists = await this.s3Service.checkIfExists(key);
      const fileExists = true;
      if (fileExists) {
        await this.outboxMessageDAO.markAsCompleted(messageId, { alreadyUploaded: true, key });
        return { alreadyUploaded: true, key };
      }
      
      // Get file from GridFS (temporary storage)
      //const fileStream = await this.gridFsService.getFileStream(fileId);
      const fileStream = true;
      if (!fileStream) {
        throw new Error(`File not found in GridFS: ${fileId}`);
      }
      
      // Upload to S3
      // const result = await this.s3Service.upload(key, fileStream, contentType, {
      //   ...metadata,
      //   idempotencyKey,
      //   outboxMessageId: messageId
      // });
      const result ={
        firstName: "John",
        lastName: "Doe",
        orderNumber: 12345
      }
      
      // Mark as completed
      await this.outboxMessageDAO.markAsCompleted(messageId, result);
      
      return result;
    } catch (error) {
      this.logger.error(`Error processing S3 upload message ${messageId}`, error);
      await this.outboxMessageDAO.markAsFailed(messageId, error.message);
      throw error;
    }
  }
}