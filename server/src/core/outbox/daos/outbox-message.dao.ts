import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { OutboxMessageDTO, OutboxMessageProcessorDTO } from "../dtos/outbox-message.dto";
import {
  OutboxMessage,
  OutboxMessageDocument,
  OutboxMessageStatus,
  OutboxMessageType,
  ProcessorStatus,
} from "../model/outbox-message.schema";
import { TenantDAO } from "src/core/dao/base-tenant.dao";
import { LoggerService } from "src/core/logger";

@Injectable()
export class OutboxMessageDAO extends TenantDAO<
  OutboxMessageDocument,
  OutboxMessageDTO
> {
  protected isTenantEntity(): boolean {
    return true;
  }
  protected isSharedEntity(): boolean {
    return false;
  }
  protected isSystemEntity(): boolean {
    return false;
  }
  private logger = LoggerService.getLogger('OutboxMessageDAO');

  constructor(
    @InjectModel(OutboxMessage.name)
    private outboxModel: Model<OutboxMessageDocument>
  ) {
    super(outboxModel, OutboxMessageDTO);
  }

  // Standard DAO methods remain the same
  protected modelToDTO(model: OutboxMessageDocument | null): OutboxMessageDTO | null {
    if (!model) return null;
    
    const dto = new OutboxMessageDTO();
    dto.id = model._id.toString();
    dto.type = model.type;
    dto.payload = model.payload;
    dto.status = model.status;
    dto.result = model.result;
    dto.error = model.error;
    dto.attempts = model.attempts;
    dto.maxAttempts = model.maxAttempts;
    dto.nextAttemptAt = model.nextAttemptAt;
    dto.processedAt = model.processedAt;
    dto.priority = model.priority;
    dto.locked = model.locked;
    dto.lockExpiresAt = model.lockExpiresAt;
    dto.correlationId = model.correlationId;
    dto.jobId = model.jobId;
    dto.initiatingUserId = model.initiatingUserId;
    dto.userContext = model.userContext;
    dto.eventType = model.eventType;
    dto.eventTags = model.eventTags;
    dto.processors = model.processors;
    dto.fullyProcessed = model.fullyProcessed;
    dto.tenantId = model.tenantId;
    dto.createDtTime = model.createDtTime;
    dto.updateDtTime = model.updateDtTime;
    dto.createdBy = model.createdBy;
    dto.updatedBy = model.updatedBy;
    
    return dto;
  }

  protected modelToDTOArray(models: OutboxMessageDocument[]): OutboxMessageDTO[] {
    return models.map(model => this.modelToDTO(model)!);
  }

  protected dtoToModel(dto: Partial<OutboxMessageDTO>): Partial<OutboxMessageDocument> {
    if (!dto) return {};
    
    const model: Partial<OutboxMessageDocument> = {};
    
    // Map all fields from DTO to model...
    if (dto.type !== undefined) model.type = dto.type;
    if (dto.payload !== undefined) model.payload = dto.payload;
    if (dto.status !== undefined) model.status = dto.status;
    if (dto.result !== undefined) model.result = dto.result;
    if (dto.error !== undefined) model.error = dto.error;
    if (dto.attempts !== undefined) model.attempts = dto.attempts;
    if (dto.maxAttempts !== undefined) model.maxAttempts = dto.maxAttempts;
    if (dto.nextAttemptAt !== undefined) model.nextAttemptAt = dto.nextAttemptAt;
    if (dto.processedAt !== undefined) model.processedAt = dto.processedAt;
    if (dto.priority !== undefined) model.priority = dto.priority;
    if (dto.locked !== undefined) model.locked = dto.locked;
    if (dto.lockExpiresAt !== undefined) model.lockExpiresAt = dto.lockExpiresAt;
    if (dto.correlationId !== undefined) model.correlationId = dto.correlationId;
    if (dto.jobId !== undefined) model.jobId = dto.jobId;
    if (dto.initiatingUserId !== undefined) model.initiatingUserId = dto.initiatingUserId;
    if (dto.userContext !== undefined) model.userContext = dto.userContext;
    if (dto.eventType !== undefined) model.eventType = dto.eventType;
    if (dto.eventTags !== undefined) model.eventTags = dto.eventTags;
    if (dto.processors !== undefined) model.processors = dto.processors;
    if (dto.fullyProcessed !== undefined) model.fullyProcessed = dto.fullyProcessed;
    if (dto.tenantId !== undefined) model.tenantId = dto.tenantId;
    
    return model;
  }

  // Specialized methods for outbox processing using BaseDAO methods
  //Enhanced for processor-based domain events
  async findPendingMessages(batchSize: number = 20): Promise<OutboxMessageDTO[]> {
    this.logger.debug(`Finding pending messages, batch size: ${batchSize}`);
    
    // Enhanced query that handles both regular messages and domain events with processors
    return await this.find({
      $or: [
        // Regular outbox messages (old flow)
        {
          status: OutboxMessageStatus.PENDING,
          jobId: null,
          nextAttemptAt: { $lte: new Date() },
          type: { $ne: OutboxMessageType.DOMAIN_EVENT }
        },
        // Domain event messages with pending processors
        {
          type: OutboxMessageType.DOMAIN_EVENT,
          'processors.status': ProcessorStatus.PENDING,
          'processors.locked': false,
          'processors.jobId': null,
          nextAttemptAt: { $lte: new Date() }
        }
      ]
    }, {
      limit: batchSize,
      sort: { priority: -1, createDtTime: 1 },
      readPreference: 'secondaryPreferred'
    });
  }

  // Methods for processor tracking
  async initializeProcessors(
    id: string,
    processorTypes: string[]
  ): Promise<OutboxMessageDTO | null> {
    const processors = processorTypes.map(type => ({
      processorType: type,
      status: ProcessorStatus.PENDING,
      attempts: 0,
      locked: false
    }));
    
    return this.update(id, { processors });
  }
  
  async updateProcessorStatus(
    id: string,
    processorType: string,
    status: ProcessorStatus,
    details?: { 
      error?: string,
      attempts?: number,
      lastAttempt?: Date,
      completedAt?: Date,
      jobId?: string,
      locked?: boolean,
      lockExpiresAt?: Date
      result?: any
    }
  ): Promise<OutboxMessageDTO | null> {
    try {
      const message = await this.findById(id);
      
      if (!message) {
        this.logger.warn(`Message not found: ${id}`);
        return null;
      }
      
      // Find processor index (or add if not exists)
      const processors = message.processors || [];
      let processorIndex = processors.findIndex(p => p.processorType === processorType);
      
      if (processorIndex === -1) {
        // Processor doesn't exist, add it
        processors.push({
          processorType,
          status: ProcessorStatus.PENDING,
          attempts: 0,
          locked: false // Add default value
        });
        processorIndex = processors.length - 1;
      }
      
      // Update processor status
      processors[processorIndex].status = status;
      
      // Update optional fields
      if (details) {
        if (details.error !== undefined) processors[processorIndex].error = details.error;
        if (details.attempts !== undefined) processors[processorIndex].attempts = details.attempts;
        if (details.lastAttempt !== undefined) processors[processorIndex].lastAttempt = details.lastAttempt;
        if (details.completedAt !== undefined) processors[processorIndex].completedAt = details.completedAt;
        if (details.jobId !== undefined) processors[processorIndex].jobId = details.jobId;
        if (details.locked !== undefined) processors[processorIndex].locked = details.locked;
        if (details.lockExpiresAt !== undefined) processors[processorIndex].lockExpiresAt = details.lockExpiresAt;
      }
      
      // Check if all processors are completed
      const allCompleted = processors.every(p => p.status === ProcessorStatus.COMPLETED);
      
      // Update message
      return this.update(id, {
        processors,
        fullyProcessed: allCompleted,
        status: allCompleted ? OutboxMessageStatus.COMPLETED : message.status,
        processedAt: allCompleted ? new Date() : message.processedAt
      });
    } catch (error) {
      this.logger.error(`Error updating processor status: ${id}/${processorType}`, error);
      throw error;
    }
  }
  
  async getProcessorStatus(
    id: string,
    processorType: string
  ): Promise<OutboxMessageProcessorDTO | null> {
    const message = await this.findById(id);
    
    if (!message) {
      return null;
    }
    
    return message.processors?.find(p => p.processorType === processorType) || null;
  }
  
  async findFailedProcessors(
    maxAttempts: number = 5,
    limit: number = 20
  ): Promise<Array<{ messageId: string, processorType: string, attempts: number }>> {
    // Find messages with failed processors that haven't reached max attempts
    // and aren't currently locked
    const messages = await this.model.aggregate([
      { $match: { 
        'processors.status': ProcessorStatus.FAILED,
        'processors.attempts': { $lt: maxAttempts },
        'processors.locked': false // Only include unlocked processors
      }},
      { $project: {
        messageId: '$_id',
        processors: {
          $filter: {
            input: '$processors',
            as: 'processor',
            cond: { 
              $and: [
                { $eq: ['$$processor.status', ProcessorStatus.FAILED] },
                { $lt: ['$$processor.attempts', maxAttempts] },
                { $eq: ['$$processor.locked', false] } // Only include unlocked processors
              ]
            }
          }
        }
      }},
      { $unwind: '$processors' },
      { $project: {
        messageId: 1,
        processorType: '$processors.processorType',
        attempts: '$processors.attempts'
      }},
      { $limit: limit }
    ]).exec();
    
    return messages;
  }

  async findNextBatchToProcess(
    batchSize: number = 10
  ): Promise<OutboxMessageDTO[]> {
    return await this.find(
      {
        status: {
          $in: [OutboxMessageStatus.PENDING, OutboxMessageStatus.FAILED],
        },
        nextAttemptAt: { $lte: new Date() },
        locked: false,
        $expr: { $lt: ["$attempts", "$maxAttempts"] },
      },
      {
        limit: batchSize,
        sort: { priority: -1, createDtTime: 1 },
        readPreference: "secondaryPreferred", // Read from secondary when possible
      }
    );
  }

  async lockMessage(
    id: string,
    lockDurationMs: number = 60000
  ): Promise<boolean> {
    const now = new Date();
    const lockExpiresAt = new Date(now.getTime() + lockDurationMs);

    try {
      // Using update method from BaseDAO
      await this.update(id, {
        locked: true,
        lockExpiresAt,
        status: OutboxMessageStatus.PROCESSING,
      });
      return true;
    } catch (error) {
      // If update fails (e.g., document not found or already locked)
      return false;
    }
  }

  async markAsCompleted(
    id: string,
    result?: Record<string, any>
  ): Promise<void> {
    // Using update method from BaseDAO
    await this.update(id, {
      status: OutboxMessageStatus.COMPLETED,
      result,
      processedAt: new Date(),
      locked: false,
      lockExpiresAt: null,
    });
  }

  async markAsFailed(id: string, error: string): Promise<void> {
    const message = await this.findById(id);

    if (!message) {
      throw new Error(`Outbox message not found: ${id}`);
    }

    const attempts = (message.attempts || 0) + 1;
    const maxAttempts = message.maxAttempts || 5;

    // Calculate next retry time with exponential backoff
    let nextAttemptAt = null;
    if (attempts < maxAttempts) {
      const backoffMs = Math.min(
        1000 * Math.pow(2, attempts),
        24 * 60 * 60 * 1000
      ); // Max 24 hours
      nextAttemptAt = new Date(new Date().getTime() + backoffMs);
    }

    // Using update method from BaseDAO
    await this.update(id, {
      status:
        attempts >= maxAttempts
          ? OutboxMessageStatus.FAILED
          : OutboxMessageStatus.PENDING,
      error,
      nextAttemptAt,
      locked: false,
      lockExpiresAt: null,
      jobId: null, // Clear job ID to allow re-queuing
      attempts, // Increment attempts
    });
  }

  /**
   * Updates the job ID for an outbox message
   * This method no longer exists in the fixed implementation
   * as we use the standard update method with more parameters
   */
  async updateJobId(id: string, jobId: string): Promise<void> {
    // Using update method from BaseDAO
    await this.update(id, {
      jobId,
      status: OutboxMessageStatus.PROCESSING, // Now also updating status
    });
  }

  async releaseStaleLocks(
    maxLockAgeMs: number = 5 * 60 * 1000
  ): Promise<number> {
    const now = new Date();

    // For this bulk operation, we'll use direct model access
    // since BaseDAO doesn't have a bulk update method
    const result = await this.model
      .updateMany(
        {
          locked: true,
          lockExpiresAt: { $lt: now },
          status: OutboxMessageStatus.PROCESSING,
        },
        {
          $set: {
            locked: false,
            lockExpiresAt: null,
            status: OutboxMessageStatus.PENDING,
            jobId: null, // Clear job ID to allow re-queuing
            updatedBy: this.getCurrentUserId(),
            updateDtTime: now,
          },
        }
      )
      .exec();

    return result.modifiedCount;
  }

  async findStuckJobs(): Promise<OutboxMessageDTO[]> {
    const cutoffTime = new Date();
    cutoffTime.setMinutes(cutoffTime.getMinutes() - 30); // Jobs stuck for 30+ minutes

    // Using standard find method from BaseDAO
    return await this.find({
      status: OutboxMessageStatus.PROCESSING,
      updateDtTime: { $lt: cutoffTime },
      jobId: { $ne: null },
    });
  }

  /**
 * Efficient check if there are any pending messages
 */
  async hasPendingMessages(): Promise<boolean> {
    const count = await this.count({
      $or: [
        // Regular outbox messages
        {
          status: OutboxMessageStatus.PENDING,
          jobId: null,
          nextAttemptAt: { $lte: new Date() },
          type: { $ne: OutboxMessageType.DOMAIN_EVENT }
        },
        // Domain event messages with pending processors
        {
          type: OutboxMessageType.DOMAIN_EVENT,
          'processors.status': ProcessorStatus.PENDING,
          'processors.locked': false,
          'processors.jobId': null,
          nextAttemptAt: { $lte: new Date() }
        }
      ]
    });
    
    return count > 0;
  }
}
