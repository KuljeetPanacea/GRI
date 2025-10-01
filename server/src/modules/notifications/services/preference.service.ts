import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { LoggerService } from 'src/core/logger';
import { BaseService } from 'src/core/service/base.service';
import { NotificationPreferenceDAO } from '../daos/notification-preference.dao';
import { NotificationType } from '../model/notification.schema';
import { Transactional } from 'src/core/decorators/transaction-decorator';
import { NotificationChannel } from '../model/notification-delivery.schema';
import { NotificationFrequency } from '../model/notification-preference.schema';
import { getNotificationEventMetadata } from 'src/core/domain-events/registry/domain-event-registry';

@Injectable()
export class PreferenceService extends BaseService {
  private logger = LoggerService.getLogger('PreferenceService');
  
  constructor(
    @InjectConnection() connection: Connection,
    private readonly preferenceDAO: NotificationPreferenceDAO
  ) {
    super(connection);
  }
  
  /**
   * Get user preference for a specific notification type
   */
  async getUserPreferenceForType(
    userId: string,
    type: NotificationType,
    tenantId: string
  ): Promise<any> {
    // Try to find existing preference
    let preference = await this.preferenceDAO.findOne({
      userId,
      notificationType: type,
      tenantId
    });
    
    if (!preference) {
      // Create default preference
      preference = await this.createDefaultPreference(userId, type, tenantId);
    }
    
    return preference;
  }
  
  /**
   * Get all user preferences
   */
  async getUserPreferences(
    userId: string,
    tenantId: string
  ): Promise<any[]> {
    return this.preferenceDAO.find({
      userId,
      tenantId
    });
  }
  
  /**
   * Update user preference
   */
  @Transactional()
  async updateUserPreference(
    userId: string,
    preference: {
      notificationType: NotificationType;
      channels: NotificationChannel[];
      frequency: NotificationFrequency;
      enabled: boolean;
      highPriorityOverride?: boolean;
      quietHoursEnabled?: boolean;
      quietHoursStart?: string;
      quietHoursEnd?: string;
      timezone?: string;
    },
    tenantId: string
  ): Promise<any> {
    // Try to find existing preference
    const existingPreference = await this.preferenceDAO.findOne({
      userId,
      notificationType: preference.notificationType,
      tenantId
    });
    
    if (existingPreference) {
      // Update existing preference
      return this.preferenceDAO.update(existingPreference.id, {
        channels: preference.channels,
        frequency: preference.frequency,
        enabled: preference.enabled,
        highPriorityOverride: preference.highPriorityOverride,
        quietHoursEnabled: preference.quietHoursEnabled,
        quietHoursStart: preference.quietHoursStart,
        quietHoursEnd: preference.quietHoursEnd,
        timezone: preference.timezone
      });
    } else {
      // Create new preference
      return this.preferenceDAO.create({
        userId,
        tenantId,
        notificationType: preference.notificationType,
        channels: preference.channels,
        frequency: preference.frequency,
        enabled: preference.enabled,
        highPriorityOverride: preference.highPriorityOverride || true,
        quietHoursEnabled: preference.quietHoursEnabled || false,
        quietHoursStart: preference.quietHoursStart,
        quietHoursEnd: preference.quietHoursEnd,
        timezone: preference.timezone || 'UTC'
      });
    }
  }
  
  /**
   * Bulk update user preferences
   */
  @Transactional()
  async bulkUpdatePreferences(
    userId: string,
    preferences: Array<{
      notificationType: NotificationType;
      channels: NotificationChannel[];
      frequency: NotificationFrequency;
      enabled: boolean;
      highPriorityOverride?: boolean;
    }>,
    tenantId: string
  ): Promise<boolean> {
    for (const preference of preferences) {
      await this.updateUserPreference(userId, preference, tenantId);
    }
    
    return true;
  }
  
  /**
   * Create default preference for a notification type
   */
  private async createDefaultPreference(
    userId: string,
    type: NotificationType,
    tenantId: string
  ): Promise<any> {
    // Get default from domain event registry if available
    // const eventMetadata = getNotificationEventMetadata()
    //   .find(e => e.eventType === this.mapNotificationTypeToEventType(type));

    //   const defaultChannels = null;
    //   if(eventMetadata.defaultChannels){
    //     const defaultChannels = eventMetadata.defaultChannels.filter((val): val is NotificationChannel => val in NotificationChannel).map(val => NotificationChannel[val as keyof typeof NotificationChannel]);
    // }
    return this.preferenceDAO.create({
      userId,
      tenantId,
      notificationType: type,
      channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
      frequency: NotificationFrequency.IMMEDIATE,
      enabled: true,
      highPriorityOverride: true,
      quietHoursEnabled: false,
      timezone: 'UTC'
    });
  }
  
  /**
   * Map notification type to domain event type
   */
  private mapNotificationTypeToEventType(type: NotificationType): string {
    const mapping: Record<NotificationType, string> = {
      [NotificationType.DOCUMENT_UPLOADED]: 'DocumentUploaded',
      [NotificationType.AUDIT_MILESTONE]: 'AuditMilestone',
      [NotificationType.FINDING_CREATED]: 'FindingCreated',
      [NotificationType.TASK_ASSIGNED]: 'TaskAssigned',
      [NotificationType.TASK_COMPLETED]: 'TaskCompleted',
      [NotificationType.COMMENT_ADDED]: 'CommentAdded',
      [NotificationType.SYSTEM_ANNOUNCEMENT]: 'SystemAnnouncement',
      [NotificationType.CreateProject]: 'CreateProject',
      [NotificationType.AEPOCCreated]: 'AEPOCCreated',
      [NotificationType.RegisterTenant]: 'RegisterTenant'
    };
    
    return mapping[type] || '';
  }
  
  /**
   * Get notification type categories
   */
  getNotificationTypeCategories(types: NotificationType[]): Record<NotificationType, string> {
    const categories: Record<NotificationType, string> = {
      [NotificationType.DOCUMENT_UPLOADED]: 'DOCUMENT',
      [NotificationType.AUDIT_MILESTONE]: 'AUDIT',
      [NotificationType.FINDING_CREATED]: 'FINDING',
      [NotificationType.TASK_ASSIGNED]: 'TASK',
      [NotificationType.TASK_COMPLETED]: 'TASK',
      [NotificationType.COMMENT_ADDED]: 'COMMENT',
      [NotificationType.SYSTEM_ANNOUNCEMENT]: 'SYSTEM',
      [NotificationType.CreateProject]: 'CreateProject',
      [NotificationType.AEPOCCreated]: 'SYSTEM',
      [NotificationType.RegisterTenant]: 'RegisterTenant'
    };
    
    return types.reduce((result, type) => {
      result[type] = categories[type] || 'GENERAL';
      return result;
    }, {} as Record<NotificationType, string>);
  }
}