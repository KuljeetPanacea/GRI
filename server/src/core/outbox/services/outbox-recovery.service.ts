// core/outbox/services/outbox-recovery.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ObjectId } from 'mongodb';
import { OutboxMessageDAO } from '../daos/outbox-message.dao';
import { LoggerService } from '../../logger/services/logger.service';
import { UserContext } from '../../contexts/user.context';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DistributedLockService } from '../../service/distributed-lock.service';
import { OutboxQueueService } from './outbox-queue.service';
import { OutboxMessageStatus } from '../model/outbox-message.schema';

@Injectable()
export class OutboxRecoveryService implements OnModuleInit {
  private logger: any;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly outboxMessageDAO: OutboxMessageDAO,
    private readonly outboxQueueService: OutboxQueueService,
    private readonly distributedLockService: DistributedLockService,
    loggerService: LoggerService
  ) {
    this.logger = loggerService.forContext('OutboxRecoveryService');
  }
  
  async onModuleInit() {
    // Run recovery on startup
    await this.withSystemContext(async () => {
      this.logger.info('Running outbox recovery on application startup');
      
      // Step 1: Recover any unfinished messages
      await this.recoverUnfinishedMessages();
      
      // Step 2: Ensure archive collection exists with proper indexes
      await this.ensureArchiveCollection();
    });
  }
  
  /**
   * Ensures the archive collection exists with proper indexes
   */
  private async ensureArchiveCollection(): Promise<void> {
    try {
      // Create the archive collection if it doesn't exist
      const collections = await this.connection.db.listCollections({ name: 'outbox_messages_archive' }).toArray();
      
      if (collections.length === 0) {
        this.logger.info('Creating outbox_messages_archive collection');
        await this.connection.db.createCollection('outbox_messages_archive');
      }
      
      // Ensure indexes on the archive collection
      await this.connection.db.collection('outbox_messages_archive').createIndexes([
        // Index for query by status and processed date
        { key: { status: 1, processedAt: 1 }, name: 'status_processed_idx' },
        
        // Index for query by correlation ID
        { key: { correlationId: 1 }, name: 'correlationId_idx' },
        
        // Index for query by type and create date
        { key: { type: 1, createDtTime: 1 }, name: 'type_created_idx' },
        
        // Index for query by user ID
        { key: { initiatingUserId: 1 }, name: 'user_idx' }
      ]);
      
      this.logger.info('Ensured outbox_messages_archive collection with indexes');
    } catch (error) {
      this.logger.error('Error ensuring archive collection', error);
    }
  }
  
  // Helper to run with system user context
  private async withSystemContext(fn: () => Promise<any>) {
    // Create a system user context for background operations
    const systemContext = {
      userId: 'system',
      roles: ['SYSTEM'],
      permissions: ['*'],
      isProductAdmin: true
    };
    
    // Run with system context
    return await UserContext.getInstance().run(systemContext, fn);
  }
  
  // Release stale locks and trigger processing
  @Cron(CronExpression.EVERY_HOUR)
  async recoverUnfinishedMessages() {
    await this.withSystemContext(async () => {
      // Try to acquire a lock to prevent multiple instances from running recovery
      const lockAcquired = await this.distributedLockService.acquire('outbox-recovery', 10 * 60 * 1000); // 10 minutes
      if (!lockAcquired) {
        return; // Another instance is already handling recovery
      }
      
      try {
        this.logger.info('Starting outbox recovery process');
        
        // Step 1: Release any stale locks (messages stuck in PENDING but locked)
        const releasedCount = await this.outboxMessageDAO.releaseStaleLocks();
        if (releasedCount > 0) {
          this.logger.info(`Released ${releasedCount} stale locks during recovery`);
        }
        
        // Step 2: Find messages that are in PROCESSING state but have been there too long
        // This might happen if a saga was interrupted between phases
        const stuckInProcessing = await this.outboxMessageDAO.findStuckJobs();
        if (stuckInProcessing.length > 0) {
          this.logger.info(`Found ${stuckInProcessing.length} messages stuck in PROCESSING state`);
          
          // For each stuck message, check if the job is actually running
          for (const message of stuckInProcessing) {
            await this.recoverStuckMessage(message);
          }
        }
        
        // Step 3: Find messages that are in PENDING state but have a jobId
        // This shouldn't happen in normal operation but could occur if a saga was interrupted
        const pendingWithJobId = await this.outboxMessageDAO.find({
          status: OutboxMessageStatus.PENDING,
          jobId: { $ne: null }
        });
        
        if (pendingWithJobId.length > 0) {
          this.logger.info(`Found ${pendingWithJobId.length} PENDING messages with job IDs`);
          
          for (const message of pendingWithJobId) {
            await this.outboxMessageDAO.update(message.id, {
              status: OutboxMessageStatus.PROCESSING
            });
            this.logger.info(`Updated status to PROCESSING for message ${message.id}`);
          }
        }
        
        // Step 4: Trigger processing of any unprocessed messages
        const queuedCount = await this.outboxQueueService.triggerProcessing();
        if (queuedCount > 0) {
          this.logger.info(`Queued ${queuedCount} messages during recovery`);
        }
        
        this.logger.info('Outbox recovery process completed');
      } finally {
        await this.distributedLockService.release('outbox-recovery');
      }
    });
  }
  
  // Recover an individual stuck message
  private async recoverStuckMessage(message: any) {
    if (!message.jobId) {
      // If no jobId, just reset to PENDING
      await this.outboxMessageDAO.update(message.id, {
        status: OutboxMessageStatus.PENDING,
        locked: false,
        lockExpiresAt: null,
        jobId: null
      });
      this.logger.info(`Reset message ${message.id} to PENDING state`);
      return;
    }
    
    try {
      // Try to check if the job is still in the queue or being processed
      // This depends on the specific message type and queue
      // For simplicity, we'll reset it to PENDING in this example
      // In a real implementation, you would check the actual queue
      
      // Reset to PENDING state but keep the error message
      await this.outboxMessageDAO.markAsFailed(message.id, 
        'Job reset during recovery: was stuck in PROCESSING state');
      
      this.logger.info(`Reset stuck message ${message.id} from PROCESSING to FAILED/PENDING`);
    } catch (error) {
      this.logger.error(`Error recovering stuck message ${message.id}`, error);
    }
  }
  
  /**
   * Manages outbox message retention using a tiered strategy:
   * 1. Completed messages: Archive after 30 days, delete from archive after 1 year
   * 2. Failed messages: Archive after 90 days, delete from archive after 2 years
   * 3. Error messages: Longer retention for troubleshooting
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async manageOutboxMessageRetention() {
    await this.withSystemContext(async () => {
      try {
        const lockAcquired = await this.distributedLockService.acquire('outbox-retention', 30 * 60 * 1000); // 30 minutes
        if (!lockAcquired) {
          return; // Another instance is already handling retention
        }
        
        try {
          this.logger.info('Starting outbox message retention management');
          
          // Step 1: Archive completed messages older than 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          // Find completed messages to archive
          const completedMessagesToArchive = await this.outboxMessageDAO.find({
            status: OutboxMessageStatus.COMPLETED,
            processedAt: { $lt: thirtyDaysAgo }
          }, { lean: true });
          
          if (completedMessagesToArchive.length > 0) {
            this.logger.info(`Archiving ${completedMessagesToArchive.length} completed messages (30+ days old)`);
            
            // Add archive timestamp and ensure proper ID format
            const messagesToInsert = completedMessagesToArchive.map(msg => {
              // Create a new object without the _id field
              const { _id, ...msgWithoutId } = msg;
              
              // Return a new object with proper MongoDB ObjectId
              return {
                ...msgWithoutId,
                _id: new ObjectId(msg.id || (msg._id ? msg._id.toString() : undefined)),
                archivedAt: new Date()
              };
            });
            
            // Insert into archive collection
            await this.connection.db.collection('outbox_messages_archive')
              .insertMany(messagesToInsert as any);
            
            // Delete the archived messages from the main collection
            const objectIds = completedMessagesToArchive.map(m => 
              new ObjectId(m.id || (m._id ? m._id.toString() : undefined))
            );
            
            const result = await this.connection.db.collection('outbox_messages')
              .deleteMany({
                _id: { $in: objectIds }
              });
              
            this.logger.info(`Deleted ${result.deletedCount} archived completed messages from main collection`);
          } else {
            this.logger.debug('No completed messages to archive');
          }
          
          // Step 2: Archive failed messages older than 90 days
          const ninetyDaysAgo = new Date();
          ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
          
          // Find failed messages to archive
          const failedMessagesToArchive = await this.outboxMessageDAO.find({
            status: OutboxMessageStatus.FAILED,
            updateDtTime: { $lt: ninetyDaysAgo }
          }, { lean: true });
          
          if (failedMessagesToArchive.length > 0) {
            this.logger.info(`Archiving ${failedMessagesToArchive.length} failed messages (90+ days old)`);
            
            // Add archive timestamp and ensure proper ID format
            const messagesToInsert = failedMessagesToArchive.map(msg => {
              // Create a new object without the _id field
              const { _id, ...msgWithoutId } = msg;
              
              // Return a new object with proper MongoDB ObjectId
              return {
                ...msgWithoutId,
                _id: new ObjectId(msg.id || (msg._id ? msg._id.toString() : undefined)),
                archivedAt: new Date()
              };
            });
            
            // Insert into archive collection
            await this.connection.db.collection('outbox_messages_archive')
              .insertMany(messagesToInsert as any);
            
            // Delete the archived messages from the main collection
            const objectIds = failedMessagesToArchive.map(m => 
              new ObjectId(m.id || (m._id ? m._id.toString() : undefined))
            );
            
            const result = await this.connection.db.collection('outbox_messages')
              .deleteMany({
                _id: { $in: objectIds }
              });
              
            this.logger.info(`Deleted ${result.deletedCount} archived failed messages from main collection`);
          } else {
            this.logger.debug('No failed messages to archive');
          }
          
          // Step 3: Delete archived completed messages older than 1 year
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          
          const oldArchivedResult = await this.connection.db.collection('outbox_messages_archive')
            .deleteMany({
              status: OutboxMessageStatus.COMPLETED,
              archivedAt: { $lt: oneYearAgo }
            });
            
          if (oldArchivedResult.deletedCount > 0) {
            this.logger.info(`Deleted ${oldArchivedResult.deletedCount} archived completed messages (1+ year old)`);
          }
          
          // Step 4: Delete archived failed messages older than 2 years
          const twoYearsAgo = new Date();
          twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
          
          const veryOldArchivedResult = await this.connection.db.collection('outbox_messages_archive')
            .deleteMany({
              status: OutboxMessageStatus.FAILED,
              archivedAt: { $lt: twoYearsAgo }
            });
            
          if (veryOldArchivedResult.deletedCount > 0) {
            this.logger.info(`Deleted ${veryOldArchivedResult.deletedCount} archived failed messages (2+ years old)`);
          }
          
          // Step 5: Gather and log statistics about current message counts
          const mainCollectionStats = await this.getOutboxCollectionStats('outbox_messages');
          const archiveCollectionStats = await this.getOutboxCollectionStats('outbox_messages_archive');
          
          this.logger.info('Outbox message counts:', {
            mainCollection: mainCollectionStats,
            archiveCollection: archiveCollectionStats
          });
          
          this.logger.info('Outbox message retention management completed');
        } finally {
          await this.distributedLockService.release('outbox-retention');
        }
      } catch (error) {
        this.logger.error('Error managing outbox message retention', error);
      }
    });
  }
  
  /**
   * Gather statistics about the message collection
   */
  private async getOutboxCollectionStats(collectionName: string): Promise<Record<string, number>> {
    const stats = {
      total: 0,
      completed: 0,
      failed: 0,
      pending: 0,
      processing: 0
    };
    
    try {
      // Get total count
      stats.total = await this.connection.db.collection(collectionName).countDocuments();
      
      // Get counts by status
      const statusCounts = await this.connection.db.collection(collectionName).aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]).toArray();
      
      // Map status counts to stats object
      for (const statusCount of statusCounts) {
        const status = statusCount._id.toLowerCase();
        if (stats.hasOwnProperty(status)) {
          stats[status] = statusCount.count;
        }
      }
    } catch (error) {
      this.logger.error(`Error getting stats for ${collectionName}`, error);
    }
    
    return stats;
  }
}