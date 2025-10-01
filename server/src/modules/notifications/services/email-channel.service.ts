import { Injectable } from '@nestjs/common';
import { OutboxService } from '../../../core/outbox/services/outbox.service';
import { LoggerService } from '../../../core/logger/services/logger.service';
import { UserService } from 'src/modules/user/services/user.service';
import { NotificationChannelService } from './notification-channel.service';
import { NotificationPriority } from '../model/notification.schema';

@Injectable()
export class EmailChannelService implements NotificationChannelService {
  private logger = LoggerService.getLogger('EmailChannelService');
  
  constructor(
    private readonly outboxService: OutboxService,
    private readonly userService: UserService // Service to get user email
  ) {}
  
  async send(
    notification: any,
    content: { subject?: string; title?: string; content: string },
    deliveryId: string
  ): Promise<string | null> {
    try {
      // Get user's email
      const user = await this.userService.findUserById(notification.userId);
      
      if (!user || !user.email) {
        this.logger.warn(`No email found for user ${notification.userId}`);
        return null;
      }

      const recipientEmail = user.email;
      
      // Use the outbox service to queue an email
      const outboxMsg = await this.outboxService.addEmailMessage(
        recipientEmail,
        content.subject || notification.title,
        content.content,
        {
          notificationId: notification.id,
          deliveryId,
          isHtml: true // Assume content is HTML
        },
        this.mapPriorityToOutboxPriority(notification.priority),
        notification.correlationId
      );
      
      return outboxMsg.id;
    } catch (error) {
      this.logger.error(`Failed to queue email notification ${notification.id}`, error);
      return null;
    }
  }
  
  private mapPriorityToOutboxPriority(priority: NotificationPriority): number {
    switch (priority) {
      case NotificationPriority.HIGH:
        return 100;
      case NotificationPriority.MEDIUM:
        return 50;
      case NotificationPriority.LOW:
        return 10;
      default:
        return 50;
    }
  }
}