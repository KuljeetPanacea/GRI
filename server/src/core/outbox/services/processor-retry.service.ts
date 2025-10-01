// core/outbox/services/processor-retry.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OutboxService } from '../services/outbox.service';
import { OutboxMessageDAO } from '../daos/outbox-message.dao';
import { ProcessorStatus } from '../model/outbox-message.schema';
import { LoggerService } from 'src/core/logger';
import { DistributedLockService } from 'src/core/service/distributed-lock.service';


@Injectable()
export class ProcessorRetryService {
  private logger = LoggerService.getLogger('ProcessorRetryService');
  
  constructor(
    @InjectQueue('notification-processor') private notificationQueue: Queue,
    @InjectQueue('ai-processor') private aiQueue: Queue,
    @InjectQueue('audit-log-processor') private auditLogQueue: Queue,
    private readonly outboxService: OutboxService,
    private readonly outboxMessageDAO: OutboxMessageDAO,
    private readonly distributedLockService: DistributedLockService
  ) {}
  
  @Cron(CronExpression.EVERY_30_SECONDS)
  async retryFailedProcessors(): Promise<void> {
    // Try to acquire a distributed lock
    const lockAcquired = await this.distributedLockService.acquire('processor-retry', 30000);
    if (!lockAcquired) {
      return; // Another instance is handling retries
    }
    
    try {
      this.logger.debug('Checking for failed processors to retry');
      
      // Find failed processors that need retry
      const failedProcessors = await this.outboxMessageDAO.findFailedProcessors(5, 20);
      
      if (failedProcessors.length === 0) {
        return;
      }
      
      this.logger.info(`Found ${failedProcessors.length} failed processors to retry`);
      
      // Process each failed processor
      for (const processor of failedProcessors) {
        try {
          // Get the domain event message
          const message = await this.outboxService.getMessage(processor.messageId);
          
          if (!message) {
            this.logger.warn(`Message not found for retry: ${processor.messageId}`);
            continue;
          }
          
          // Get the appropriate queue for this processor type
          const queue = this.getQueueForProcessor(processor.processorType);
          
          if (!queue) {
            this.logger.warn(`No queue configured for processor type: ${processor.processorType}`);
            continue;
          }
          
          // Calculate backoff delay
          const backoffDelay = Math.pow(2, processor.attempts) * 1000; // Exponential backoff
          
          // Add retry job
          await queue.add('process', {
            messageId: processor.messageId,
            processorType: processor.processorType,
            eventType: message.eventType
          }, {
            delay: backoffDelay,
            jobId: `retry-${processor.messageId}-${processor.processorType}-${processor.attempts + 1}`
          });
          
          // Update processor status to pending for retry
          await this.outboxService.updateProcessorStatus(
            processor.messageId,
            processor.processorType,
            ProcessorStatus.PENDING,
            { 
              attempts: processor.attempts + 1,
              lastAttempt: new Date(),
              locked: false, // Make sure it's not locked
              lockExpiresAt: null
            }
          );
          
          this.logger.debug(`Scheduled retry for ${processor.processorType} processor on message ${processor.messageId}`);
        } catch (error) {
          this.logger.error(`Error scheduling retry for processor: ${processor.processorType}/${processor.messageId}`, error);
        }
      }
    } finally {
      await this.distributedLockService.release('processor-retry');
    }
  }
  
  private getQueueForProcessor(processorType: string): Queue | null {
    switch (processorType) {
      case 'notification':
        return this.notificationQueue;
      case 'ai':
        return this.aiQueue;
      case 'audit-log':
        return this.auditLogQueue;
      default:
        return null;
    }
  }
}