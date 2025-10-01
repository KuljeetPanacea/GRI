import { Injectable } from '@nestjs/common';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { OutboxMessageDAO } from '../daos/outbox-message.dao';
import { LoggerService } from '../../logger/services/logger.service';
import { UserContext } from '../../contexts/user.context';
//import { BullService } from '../../queue/services/bull.service';

@Processor('bull-task-processor')
export class BullTaskProcessorService {
  constructor(
    private readonly outboxMessageDAO: OutboxMessageDAO,
    //private readonly bullService: BullService,
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
  async processBullTask(job: Job<{ messageId: string }>) {
    const { messageId } = job.data;
    const message = await this.outboxMessageDAO.findById(messageId);
    
    if (!message) {
      throw new Error(`Bull task message not found: ${messageId}`);
    }
    
    // Restore user context
    await this.setupUserContext(message);
    
    try {
      const { queue, name, data, options } = message.payload;
      
      // Add idempotency key to prevent duplication if this gets reprocessed
      const idempotencyKey = message.id;
      const taskData = { ...data, _idempotencyKey: idempotencyKey };
      
      // Check if job already exists with this idempotency key
      //const existingJobs = await this.bullService.findJobsByIdempotencyKey(queue, idempotencyKey);
      // if (existingJobs.length > 0) {
      //   await this.outboxMessageDAO.markAsCompleted(messageId, { alreadyQueued: true, jobId: existingJobs[0].id });
      //   return { alreadyQueued: true, jobId: existingJobs[0].id };
      // }
      
      // Add to Bull queue
      // const bullJob = await this.bullService.addJob(queue, name, taskData, options);
      
      // // Mark as completed
      //const result = { jobId: bullJob.id, queue, name };
       const result = { jobId: 1234, queue, name };
      // await this.outboxMessageDAO.markAsCompleted(messageId, result);
      
      return result;
    } catch (error) {
      this.logger.error(`Error processing Bull task message ${messageId}`, error);
      await this.outboxMessageDAO.markAsFailed(messageId, error.message);
      throw error;
    }
  }
}