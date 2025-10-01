import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { OutboxMessageDAO } from '../daos/outbox-message.dao';
import { OutboxMessageDTO } from '../dtos/outbox-message.dto';
import { OutboxMessageType, OutboxMessageStatus, ProcessorStatus } from '../model/outbox-message.schema';
import { UserContext } from '../../contexts/user.context';
import { v4 as uuidv4 } from 'uuid';
import { BaseService } from 'src/core/service/base.service';
import { LoggerService } from 'src/core/logger/services/logger.service';
import { TenantContext } from 'src/core/contexts/tenant.context';
import { Transactional } from 'src/core/decorators/transaction-decorator';
import { DomainEvent } from 'src/core/domain-events/domain-event.base';
import { getProcessorsForEvent } from 'src/core/domain-events/registry/domain-event-registry';

@Injectable()
export class OutboxService extends BaseService {
  constructor(
    @InjectConnection() connection: Connection,
    private readonly outboxMessageDAO: OutboxMessageDAO,
    private readonly logger: LoggerService
  ) {
    super(connection);
  }
  
  // Capture current user context
  private getCurrentUserContext() {
    const userContext = UserContext.getInstance();
    const userId = userContext.getUserId();
    
    // If no user is logged in, return null
    if (!userId) return null;
    
    return {
      userId,
      roles: userContext.getRoles(),
      permissions: userContext.getPermissions(),
      isProductAdmin: userContext.isProductAdmin()
    };
  }

   // Add domain event to outbox
   @Transactional()
   async publishDomainEvent<T extends DomainEvent>(
     event: T,
     options?: { 
       priority?: number,
       tags?: string[],
       processorTypes?: string[] // Optional explicit processors
     }
   ): Promise<OutboxMessageDTO> {
     // Capture the current user context
     const userContext = this.getCurrentUserContext();
     const userId = userContext?.userId;
     const tenantId = TenantContext.getInstance().getTenantId();
     
     const eventType = event.getType();
     const eventData = event.toJSON();
     
     this.logger.debug(`Publishing domain event: ${eventType}`, { 
       correlationId: event.correlationId,
       userId
     });
     
     // Determine processor types from registry or explicit options
     const processorTypes = options?.processorTypes || getProcessorsForEvent(eventType);
     
     // Initialize processors
     const processors = processorTypes.map(type => ({
       processorType: type,
       status: ProcessorStatus.PENDING,
       attempts: 0,
       locked: false
     }));
     
     // Create the outbox message for this domain event
     return await this.outboxMessageDAO.create({
       type: OutboxMessageType.DOMAIN_EVENT,
       eventType,
       eventTags: options?.tags || [],
       payload: eventData,
       status: OutboxMessageStatus.PENDING,
       priority: options?.priority || 0,
       correlationId: event.correlationId,
       nextAttemptAt: new Date(), // Ready for immediate processing
       attempts: 0,
       initiatingUserId: userId,
       userContext,
       tenantId,
       processors,
       fullyProcessed: processors.length === 0 // If no processors, mark as fully processed
     });
   }
  
  // Add email message to outbox (within transaction)
  async addEmailMessage(
    to: string | string[], 
    subject: string, 
    body: string, 
    options?: any,
    priority: number = 0,
    correlationId?: string,
    tenantId?: string
  ): Promise<OutboxMessageDTO> {
    // Capture the current user context
    const userContext = this.getCurrentUserContext();

    const userId = userContext?.userId;
    // Create the outbox message with user context (no Bull queue yet!)
    return await this.outboxMessageDAO.create({
      type: OutboxMessageType.EMAIL,
      payload: {
        to,
        subject,
        body,
        options
      },
      status: OutboxMessageStatus.PENDING,
      priority,
      correlationId: correlationId || uuidv4(),
      nextAttemptAt: new Date(), // Ready for immediate processing
      attempts: 0,
      initiatingUserId: userId,
      userContext,
      tenantId
    });
  }
  
  // Add S3 upload message to outbox (within transaction)
  async addS3UploadMessage(
    key: string,
    fileId: string,
    contentType: string,
    metadata?: any,
    priority: number = 0,
    correlationId?: string
  ): Promise<OutboxMessageDTO> {
    // Capture the current user context
    const userContext = this.getCurrentUserContext();
    const userId = userContext?.userId;
    
    return await this.outboxMessageDAO.create({
      type: OutboxMessageType.S3_UPLOAD,
      payload: {
        key,
        fileId,
        contentType,
        metadata
      },
      status: OutboxMessageStatus.PENDING,
      priority,
      correlationId: correlationId || uuidv4(),
      nextAttemptAt: new Date(), // Ready for immediate processing
      attempts: 0,
      initiatingUserId: userId,
      userContext
    });
  }
  
  // Add Bull task message to outbox (within transaction)
  async addBullTaskMessage(
    queue: string,
    name: string,
    data: any,
    options?: any,
    priority: number = 0,
    correlationId?: string
  ): Promise<OutboxMessageDTO> {
    // Capture the current user context
    const userContext = this.getCurrentUserContext();
    const userId = userContext?.userId;
    
    return await this.outboxMessageDAO.create({
      type: OutboxMessageType.BULL_TASK,
      payload: {
        queue,
        name,
        data,
        options
      },
      status: OutboxMessageStatus.PENDING,
      priority,
      correlationId: correlationId || uuidv4(),
      nextAttemptAt: new Date(), // Ready for immediate processing
      attempts: 0,
      initiatingUserId: userId,
      userContext
    });
  }
  
  // Add RabbitMQ message to outbox (within transaction)
  async addRabbitMQMessage(
    exchange: string,
    routingKey: string,
    message: any,
    options?: any,
    priority: number = 0,
    correlationId?: string
  ): Promise<OutboxMessageDTO> {
    // Capture the current user context
    const userContext = this.getCurrentUserContext();
    const userId = userContext?.userId;
    
    return await this.outboxMessageDAO.create({
      type: OutboxMessageType.RABBITMQ_MESSAGE,
      payload: {
        exchange,
        routingKey,
        message,
        options
      },
      status: OutboxMessageStatus.PENDING,
      priority,
      correlationId: correlationId || uuidv4(),
      nextAttemptAt: new Date(), // Ready for immediate processing
      attempts: 0,
      initiatingUserId: userId,
      userContext
    });
  }
  
  // Get messages for a correlation ID
  async getMessagesByCorrelationId(correlationId: string): Promise<OutboxMessageDTO[]> {
    return await this.outboxMessageDAO.find({ correlationId });
  }
  
  // Get message status by ID
  async getMessageStatus(id: string): Promise<{ status: OutboxMessageStatus, attempts: number, error?: string }> {
    const message = await this.outboxMessageDAO.findById(id);
    if (!message) {
      throw new Error(`Message not found: ${id}`);
    }
    
    return {
      status: message.status,
      attempts: message.attempts,
      error: message.error
    };
  }

  // Method to update processor status
  async updateProcessorStatus(
    id: string,
    processorType: string,
    status: ProcessorStatus,
    details?: any
  ): Promise<OutboxMessageDTO | null> {
    return this.outboxMessageDAO.updateProcessorStatus(id, processorType, status, details);
  }
  
  // Get message for a specific ID
  async getMessage(id: string): Promise<OutboxMessageDTO | null> {
    return this.outboxMessageDAO.findById(id);
  }
  
}