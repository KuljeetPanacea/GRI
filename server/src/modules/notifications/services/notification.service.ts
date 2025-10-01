// ===============================================
// 9. NOTIFICATION CORE SERVICES
// ===============================================

// notifications/services/notification.service.ts
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/core/logger';
import { BaseService } from 'src/core/service/base.service';
import { DeliveryStatus, NotificationChannel } from '../model/notification-delivery.schema';
import { Connection, ClientSession } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";
import { Transactional } from 'src/core/decorators/transaction-decorator';
import { NotificationPriority, NotificationStatus, NotificationType } from '../model/notification.schema';
import { NotificationDAO } from '../daos/notification.dao';
import { NotificationDeliveryDAO } from '../daos/notification-delivery.dao';
import { EmailChannelService } from './email-channel.service';
import { InAppChannelService } from './in-app-channel.service';
import { DigestService } from './digest.service';
// import { NotificationDAO } from '../daos/notification.dao';
// import { NotificationDeliveryDAO } from '../daos/notification-delivery.dao';
// import { NotificationChannel, DeliveryStatus } from '../schemas/notification-delivery.schema';
// import { NotificationStatus, NotificationType, NotificationPriority } from '../schemas/notification.schema';
// import { LoggerService } from '../../core/logger/services/logger.service';
// import { EmailChannelService } from './channels/email-channel.service';
// import { InAppChannelService } from './channels/in-app-channel.service';
// import { WhatsAppChannelService } from './channels/whatsapp-channel.service';
// import { DigestService } from './digest.service';
// import { BaseService } from '../../core/services/base.service';
// import { Transactional } from '../../core/services/decorators/transactional.decorator';

@Injectable()
export class NotificationService extends BaseService {
  private logger = LoggerService.getLogger('NotificationService');
  private channelServices: Map<NotificationChannel, any> = new Map();
  
  constructor(
    @InjectConnection() connection: Connection,
    private readonly notificationDAO: NotificationDAO,
    private readonly notificationDeliveryDAO: NotificationDeliveryDAO,
     private readonly emailChannelService: EmailChannelService,
    // private readonly inAppChannelService: InAppChannelService,
    // private readonly whatsAppChannelService: InAppChannelService,
    // private readonly digestService: DigestService
  ) {
    super(connection);
    
    // Register channel services
     this.channelServices.set(NotificationChannel.EMAIL, this.emailChannelService);
    // this.channelServices.set(NotificationChannel.IN_APP, this.inAppChannelService);
    // this.channelServices.set(NotificationChannel.WHATSAPP, this.whatsAppChannelService);
  }
  
  // Create a notification record
  @Transactional()
  async createNotification(dto: {
    tenantId: string;
    type: NotificationType;
    categoryCode: string;
    userId: string;
    title: string;
    content: string;
    priority: NotificationPriority;
    data: Record<string, any>;
    correlationId?: string;
    auditId?: string;
    documentId?: string;
    findingId?: string;
    taskId?: string;
  }): Promise<any> {
    return this.notificationDAO.create({
      tenantId: dto.tenantId,
      type: dto.type,
      categoryCode: dto.categoryCode,
      userId: dto.userId,
      title: dto.title,
      content: dto.content,
      priority: dto.priority,
      data: dto.data,
      status: NotificationStatus.PENDING,
      correlationId: dto.correlationId,
      auditId: dto.auditId,
      documentId: dto.documentId,
      findingId: dto.findingId,
      taskId: dto.taskId
    });
  }
  
  // Process delivery strategy based on user preferences
  async processDeliveryStrategy(
    notification: any,
    preferences: any,
    renderedTemplates: Record<NotificationChannel, { subject?: string, title?: string, content: string }>
  ): Promise<void> {
    const isPrioritized = notification.priority === NotificationPriority.HIGH && preferences.highPriorityOverride;

    // Check if notification should be delivered immediately
    if (preferences.frequency === 'IMMEDIATE' || isPrioritized) {
      // Check if in quiet hours
      const inQuietHours = this.isInQuietHours(preferences);
      
      if (!inQuietHours || isPrioritized) {
        // Send immediately
        await this.deliverToSelectedChannels(
          notification,
          preferences.channels,
          renderedTemplates
        );
      } else {
        // Queue for delivery after quiet hours
        // await this.digestService.queueForQuietHoursDelivery(
        //   notification.id,
        //   notification.userId,
        //   notification.tenantId
        // );
      }
    } else {
      // Add to digest queue based on preference frequency
      // await this.digestService.addToDigestQueue(
      //   notification.id,
      //   notification.userId,
      //   notification.tenantId,
      //   preferences.frequency
      // );
    }
  }
  
  // Deliver notification to selected channels
  private async deliverToSelectedChannels(
    notification: any,
    channels: NotificationChannel[],
    renderedTemplates: Record<NotificationChannel, { subject?: string, title?: string, content: string }>
  ): Promise<void> {
    // Update notification status
    await this.notificationDAO.update(notification.id, {
      status: NotificationStatus.DELIVERED,
      deliveredAt: new Date()
    });
    // Deliver to each channel
    for (const channel of channels) {
      try {
        // If template is missing for this channel, skip it
        if (!renderedTemplates[channel]) {
          this.logger.warn(`Missing template for channel ${channel}, notification ${notification.id}`);
          continue;
        }
        
        // Get channel service
        const channelService = await this.channelServices.get(channel);
        
        if (!channelService) {
          this.logger.error(`No service found for channel ${channel}`);
          continue;
        }
        
        // Create delivery record
        const delivery = await this.notificationDeliveryDAO.create({
          notificationId: notification.id,
          userId: notification.userId,
          tenantId: notification.tenantId,
          channel,
          status: DeliveryStatus.PENDING
        });
        
        // Send to channel
        const outboxMessageId = await channelService.send(
          notification,
          renderedTemplates[channel],
          delivery.id
        );

        // Update delivery record with outbox message ID
        if (outboxMessageId) {
          await this.notificationDeliveryDAO.update(delivery.id, {
            outboxMessageId,
            status: DeliveryStatus.QUEUED
          });
        }
      } catch (error) {
        this.logger.error(`Error delivering notification ${notification.id} to channel ${channel}`, error);
      }
    }
  }
  
  // Check if current time is within user's quiet hours
  private isInQuietHours(preferences: any): boolean {
    if (!preferences.quietHoursEnabled) {
      return false;
    }
    
    if (!preferences.quietHoursStart || !preferences.quietHoursEnd) {
      return false;
    }
    
    const now = new Date();
    const userTimezone = preferences.timezone || 'UTC';
    
    // Format current time in user's timezone
    const options = { timeZone: userTimezone, hour12: false };
    const currentTime = now.toLocaleTimeString('en-US', options);
    const currentHour = parseInt(currentTime.split(':')[0], 10);
    const currentMinute = parseInt(currentTime.split(':')[1], 10);
    
    // Parse quiet hours start/end
    const startHour = parseInt(preferences.quietHoursStart.split(':')[0], 10);
    const startMinute = parseInt(preferences.quietHoursStart.split(':')[1], 10);
    const endHour = parseInt(preferences.quietHoursEnd.split(':')[0], 10);
    const endMinute = parseInt(preferences.quietHoursEnd.split(':')[1], 10);
    
    // Convert to minutes for easier comparison
    const currentTimeMinutes = currentHour * 60 + currentMinute;
    const startTimeMinutes = startHour * 60 + startMinute;
    const endTimeMinutes = endHour * 60 + endMinute;
    
    // Check if current time is within quiet hours
    if (startTimeMinutes < endTimeMinutes) {
      // Simple case: start time is before end time (e.g., 22:00 to 06:00)
      return currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes;
    } else {
      // Complex case: quiet hours span midnight (e.g., 22:00 to 06:00)
      return currentTimeMinutes >= startTimeMinutes || currentTimeMinutes <= endTimeMinutes;
    }
  }
  
  // API methods for notification management
  async getNotifications(
    userId: string,
    tenantId: string,
    options?: {
      page?: number;
      perPage?: number;
      read?: boolean;
      types?: NotificationType[];
    }
  ): Promise<{ notifications: any[], total: number }> {
    const { page = 1, perPage = 20, read, types } = options || {};
    
    // Build filter
    const filter: any = { 
      userId, 
      tenantId 
    };
    
    // Add read filter if specified
    if (read !== undefined) {
      filter.readAt = read ? { $ne: null } : null;
    }
    
    // Add type filter if specified
    if (types && types.length > 0) {
      filter.type = { $in: types };
    }
    
    // Get total count
    const total = await this.notificationDAO.count(filter);
    
    // Get notifications with pagination
    const notifications = await this.notificationDAO.find(filter, {
      sort: { createDtTime: -1 },
      skip: (page - 1) * perPage,
      limit: perPage
    });
    
    return { notifications, total };
  }
  
  async markAsRead(id: string, userId: string): Promise<boolean> {
    // Find notification
    const notification = await this.notificationDAO.findOne({ 
      _id: id, 
      userId
    });
    
    if (!notification) {
      return false;
    }
    
    // Already read
    if (notification.readAt) {
      return true;
    }
    
    // Mark as read and update status
    await this.notificationDAO.update(id, {
      readAt: new Date(),
      status: NotificationStatus.READ
    });
    
    // Update delivery records
    // await this.notificationDeliveryDAO.updateMany(
    //   { notificationId: id, userId },
    //   { readAt: new Date(), status: DeliveryStatus.READ }
    // );
    
    return true;
  }
  
  async getUnreadCount(userId: string, tenantId: string): Promise<number> {
    return this.notificationDAO.count({
      userId,
      tenantId,
      readAt: null
    });
  }
}