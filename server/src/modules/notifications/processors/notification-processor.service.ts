import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { LoggerService } from 'src/core/logger';
import { OutboxMessageDTO, OutboxService, ProcessorStatus } from 'src/core/outbox';
import { OutboxMessageDAO } from 'src/core/outbox/daos/outbox-message.dao';
import { NotificationChannel } from '../model/notification-delivery.schema';
import { NotificationPriority, NotificationType } from '../model/notification.schema';
import { UserContext } from 'src/core/contexts/user.context';
import { NotificationService } from '../services/notification.service';
import { TemplateService } from '../services/template.service';
import { PreferenceService } from '../services/preference.service';
import { TenantContext } from 'src/core/contexts/tenant.context';

@Processor('notification-processor')
export class NotificationProcessor {
  private logger = LoggerService.getLogger('NotificationProcessor');
  
  constructor(
    private readonly outboxService: OutboxService,
    private readonly outboxMessageDAO: OutboxMessageDAO,
    private readonly notificationService: NotificationService,
    private readonly templateService: TemplateService,
    private readonly preferenceService: PreferenceService
  ) {}
  
  @Process('process')
  async processNotification(job: Job<{ messageId: string, processorType: string, eventType: string }>): Promise<any> {
    const { messageId, processorType, eventType } = job.data;
    
    try {
      this.logger.debug(`Processing notification for message ${messageId}, event type ${eventType}`);
      
      
      // Get the domain event message
      const message = await this.outboxMessageDAO.findById(messageId);
      if (!message) {
        throw new Error(`Message not found: ${messageId}`);
      }
      
      // Set up context from the original message
      //await this.setupUserContext(message);
      
      // Get recipient info from the event data
      const eventData = message.payload;
      const initiatingUserIds = eventData.notifiedUserId;
      const tenantId = message.tenantId;
      
      await UserContext.getInstance().run(
       message.userContext
      , async () => {
        TenantContext.getInstance().run(tenantId, async () => {
          for (const initiatingUserId of initiatingUserIds) {
            await this.notificationProcess(
              tenantId,
              eventType,
              initiatingUserId,
              messageId,
              processorType,
              eventData,
              message
            );
          }
      });

    });
      // Map domain event type to notification type
      
    } catch (error) {
      this.logger.error(`Error processing notification for message ${messageId}`, error);
      
      // Update processor status to failed
      await this.outboxService.updateProcessorStatus(
        messageId,
        processorType,
        ProcessorStatus.FAILED,
        { 
          error: error.message,
          lastAttempt: new Date()
        }
      );
      
      throw error;
    }
  }
  
  private async notificationProcess(tenantId: any, eventType: string, userId: string, messageId: string, processorType: string, eventData: Record<string, any>, message: OutboxMessageDTO) {
   
      const notificationType = this.mapEventTypeToNotificationType(eventType);

      // Get category for this notification type
      const categoryCode = this.getCategoryForNotificationType(notificationType);
      // Get user's preferences for this notification type
      const preferences = await this.preferenceService.getUserPreferenceForType(
        userId,
        notificationType,
        tenantId
      );
      // If notifications are disabled, don't send
      if (!preferences.enabled) {
        this.logger.debug(`Notifications disabled for user ${userId} and type ${notificationType}`);

        // Still mark as completed since this was intentionally skipped
        await this.outboxService.updateProcessorStatus(
          messageId,
          processorType,
          ProcessorStatus.COMPLETED,
          { completedAt: new Date() }
        );

        return { success: true, skipped: true, reason: 'notifications_disabled' };
      }

      // Process templates to get notification content
      const renderedTemplates = await this.templateService.processTemplatesForNotification(
        notificationType,
        eventData,
        tenantId
      );

      this.checkAndAddUrl(notificationType, eventData, renderedTemplates);

      // Use in-app template for fallback title/content if not provided
      const inAppTemplate = renderedTemplates[NotificationChannel.IN_APP];

      const title = inAppTemplate?.title || this.generateTitleFromEvent(eventType, eventData);
      const content = inAppTemplate?.content || JSON.stringify(eventData);

      // Create notification record
      const notification = await this.notificationService.createNotification({
        tenantId,
        type: notificationType,
        categoryCode,
        userId,
        title,
        content,
        priority: this.getPriorityFromEvent(eventType, eventData),
        data: eventData,
        // status: NotificationStatus.PENDING,
        correlationId: message.correlationId,
        auditId: eventData.auditId,
        documentId: eventData.documentId,
        findingId: eventData.findingId,
        taskId: eventData.taskId
      });

      // Determine delivery approach (immediate or digest) based on preferences
      await this.notificationService.processDeliveryStrategy(notification, preferences, renderedTemplates);
      // await this.outboxService.addEmailMessage(
      //   emailTo,
      //   renderedTemplates.EMAIL.subject,
      //   renderedTemplates.EMAIL.content,
      //   "",
      //   1,
      //   message.correlationId,
      //   tenantId
      // );

      // Mark processor as completed
      await this.outboxService.updateProcessorStatus(
        messageId,
        processorType,
        ProcessorStatus.COMPLETED,
        { completedAt: new Date() }
      );

      return { success: true, notificationId: notification.id };
   
  }

  private checkAndAddUrl(notificationType: NotificationType, eventData: Record<string, any>, renderedTemplates: Record<NotificationChannel, { subject?: string; title?: string; content: string; }>) {
    if (notificationType == NotificationType.AEPOCCreated) {
      const resetUrl = `${process.env.FRONTEND_URL_LOCAL}/update-password?userId=${eventData.userId}`;
      renderedTemplates.EMAIL.content += resetUrl;
    }
  }

  // Set up user context from original message
  private async setupUserContext(message: any): Promise<void> {
    if (message.userContext) {

      // Use the original user's context if available
      await UserContext.getInstance().run(message.userContext, async () => {
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
      
      await UserContext.getInstance().run(systemContext, async () => {
        this.logger.debug('Processing with system context');
      });
    }
  }
  
  // Map domain event type to notification type
  private mapEventTypeToNotificationType(eventType: string): NotificationType {
    const mapping: Record<string, NotificationType> = {
      'DocumentUploaded': NotificationType.DOCUMENT_UPLOADED,
      'AuditMilestone': NotificationType.AUDIT_MILESTONE,
      'FindingCreated': NotificationType.FINDING_CREATED,
      'AssignTask': NotificationType.TASK_ASSIGNED,
      'AEPOCCreated': NotificationType.AEPOCCreated,
      'CreateProject': NotificationType.CreateProject,
      'RegisterTenant': NotificationType.RegisterTenant
      // Add mappings for other event types
    };
    
    return mapping[eventType] || NotificationType.SYSTEM_ANNOUNCEMENT;
  }
  
  // Get category from notification type
  private getCategoryForNotificationType(type: NotificationType): string {
    const mapping: Record<string, string> = {
      [NotificationType.DOCUMENT_UPLOADED]: 'DOCUMENT',
      [NotificationType.AUDIT_MILESTONE]: 'AUDIT',
      [NotificationType.FINDING_CREATED]: 'FINDING',
      [NotificationType.TASK_ASSIGNED]: 'TASK',
      [NotificationType.TASK_COMPLETED]: 'TASK',
      [NotificationType.COMMENT_ADDED]: 'COMMENT',
      [NotificationType.SYSTEM_ANNOUNCEMENT]: 'SYSTEM',
      [NotificationType.AEPOCCreated]: 'TASK',
      
    };
    
    return mapping[type] || 'GENERAL';
  }
  
  // Generate title from event if template doesn't provide one
  private generateTitleFromEvent(eventType: string, eventData: any): string {
    switch (eventType) {
      case 'DocumentUploaded':
        return `New document uploaded: ${eventData.documentName}`;
      case 'AuditMilestone':
        return `Audit milestone completed: ${eventData.milestoneName}`;
      case 'FindingCreated':
        return `New finding created: ${eventData.findingTitle}`;
      default:
        return `New notification: ${eventType}`;
    }
  }
  
  // Determine notification priority based on event type
  private getPriorityFromEvent(eventType: string, eventData: any): NotificationPriority {
    // Some events might be automatically high priority
    const highPriorityEvents = ['FindingCreated', 'TaskOverdue'];
    
    if (highPriorityEvents.includes(eventType)) {
      return NotificationPriority.HIGH;
    }
    
    // Check for severity in finding events
    if (eventType === 'FindingCreated' && eventData.findingSeverity === 'HIGH') {
      return NotificationPriority.HIGH;
    }
    
    return NotificationPriority.MEDIUM;
  }
}