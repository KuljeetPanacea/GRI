import { Injectable } from '@nestjs/common';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { OutboxMessageDAO } from '../daos/outbox-message.dao';
import { LoggerService } from '../../logger/services/logger.service';
import { UserContext } from '../../contexts/user.context';
//import { RabbitMQService } from '../../messaging/services/rabbitmq.service';

@Processor('rabbitmq-processor')
export class RabbitMQProcessorService {
  constructor(
    private readonly outboxMessageDAO: OutboxMessageDAO,
    //private readonly rabbitMQService: RabbitMQService,
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
  async processRabbitMQMessage(job: Job<{ messageId: string }>) {
    const { messageId } = job.data;
    const message = await this.outboxMessageDAO.findById(messageId);
    
    if (!message) {
      throw new Error(`RabbitMQ message not found: ${messageId}`);
    }
    
    // Restore user context
    await this.setupUserContext(message);
    
    try {
      const { exchange, routingKey, message: msgContent, options } = message.payload;
      
      // Add idempotency key to message headers
      const idempotencyKey = message.id;
      const messageWithHeader = {
        ...msgContent,
        _meta: {
          ...(msgContent._meta || {}),
          idempotencyKey,
          outboxMessageId: messageId,
          initiatingUserId: message.initiatingUserId
        }
      };
      
      // Publish to RabbitMQ
      // const result = await this.rabbitMQService.publish(
      //   exchange,
      //   routingKey,
      //   messageWithHeader,
      //   options
      // );
      const result = true;
      // // Mark as completed
      // await this.outboxMessageDAO.markAsCompleted(messageId, result);
      
      return result;
    } catch (error) {
      this.logger.error(`Error processing RabbitMQ message ${messageId}`, error);
      await this.outboxMessageDAO.markAsFailed(messageId, error.message);
      throw error;
    }
  }
}