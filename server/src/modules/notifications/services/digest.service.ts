import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BaseService } from 'src/core/service/base.service';
import { LoggerService } from 'src/core/logger';
import { NotificationDigestQueueDAO } from '../daos/notification-digest-queue.dao';
import { NotificationService } from './notification.service';
import { DistributedLockService } from 'src/core/service/distributed-lock.service';
import { TemplateService } from './template.service';
import { NotificationFrequency } from '../model/notification-preference.schema';
import { Transactional } from 'src/core/decorators/transaction-decorator';
import { UserContext } from 'src/core/contexts/user.context';


@Injectable()
export class DigestService extends BaseService {
  private logger = LoggerService.getLogger('DigestService');
  
  constructor(
    @InjectConnection() connection: Connection,
    private readonly digestQueueDAO: NotificationDigestQueueDAO,
    private readonly notificationService: NotificationService,
    private readonly templateService: TemplateService,
    private readonly distributedLockService: DistributedLockService
  ) {
    super(connection);
  }
  
  /**
   * Helper to run with system user context
   */
  private async withSystemContext(fn: () => Promise<any>) {
    const systemContext = {
      userId: 'system',
      roles: ['SYSTEM'],
      permissions: ['*'],
      isProductAdmin: true
    };
    
    return await UserContext.getInstance().run(systemContext, fn);
  }
  
  /**
   * Add notification to digest queue
   */
  @Transactional()
  async addToDigestQueue(
    notificationId: string,
    userId: string,
    tenantId: string,
    frequency: NotificationFrequency
  ): Promise<void> {
    // Calculate next digest time
    const nextDigestTime = this.calculateNextDigestTime(frequency);
    
    // Check if digest already exists
    let digest = await this.digestQueueDAO.findOne({
      userId,
      tenantId,
      digestType: frequency,
      scheduledFor: { $gte: new Date() },
      processed: false
    });
    
    if (digest) {
      // Add to existing digest
      const notifications = [...digest.notifications, notificationId];
      await this.digestQueueDAO.update(digest.id, {
        notifications
      });
    } else {
      // Create new digest
      await this.digestQueueDAO.create({
        userId,
        tenantId,
        notifications: [notificationId],
        digestType: frequency,
        scheduledFor: nextDigestTime,
        processed: false
      });
    }
  }
  
  /**
   * Queue notification for delivery after quiet hours
   */
  @Transactional()
  async queueForQuietHoursDelivery(
    notificationId: string,
    userId: string,
    tenantId: string
  ): Promise<void> {
    // Queue for delivery at end of quiet hours
    // This is a simplified version - would need preference-specific queue timing
    
    // For now, just add to hourly digest as example
    await this.addToDigestQueue(
      notificationId,
      userId,
      tenantId,
      NotificationFrequency.HOURLY_DIGEST
    );
  }
  
  /**
   * Calculate next digest time based on frequency
   */
  private calculateNextDigestTime(frequency: NotificationFrequency): Date {
    const now = new Date();
    
    switch (frequency) {
      case NotificationFrequency.HOURLY_DIGEST:
        // Next hour
        return new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours() + 1,
          0, 0, 0
        );
        
      case NotificationFrequency.DAILY_DIGEST:
        // 9:00 AM tomorrow
        return new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          9, 0, 0, 0
        );
        
      default:
        // Default to 1 hour later
        return new Date(now.getTime() + 60 * 60 * 1000);
    }
  }
  
  /**
   * Process digest queues
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async processDigestQueues(): Promise<void> {
    await this.withSystemContext(async () => {
      // Acquire lock
      const lockAcquired = await this.distributedLockService.acquire('digest-processor', 30000);
      if (!lockAcquired) {
        return;
      }
      
      try {
        // Find due digests
        const dueDigests = await this.digestQueueDAO.find({
          scheduledFor: { $lte: new Date() },
          processed: false
        });
        
        if (dueDigests.length === 0) {
          return;
        }
        
        this.logger.info(`Processing ${dueDigests.length} notification digests`);
        
        // Process each digest
        for (const digest of dueDigests) {
          try {
            await this.processDigest(digest);
          } catch (error) {
            this.logger.error(`Error processing digest ${digest.id}`, error);
          }
        }
      } finally {
        await this.distributedLockService.release('digest-processor');
      }
    });
  }
  
  /**
   * Process a single digest
   */
  private async processDigest(digest: any): Promise<void> {
    if (!digest.notifications || digest.notifications.length === 0) {
      // Mark as processed if empty
      await this.digestQueueDAO.update(digest.id, {
        processed: true
      });
      return;
    }
    
    // TODO: Implement actual digest processing
    // This would include:
    // 1. Grouping notifications by type
    // 2. Generating digest content
    // 3. Sending via appropriate channels
    
    // For now, just mark as processed
    await this.digestQueueDAO.update(digest.id, {
      processed: true
    });
  }
}