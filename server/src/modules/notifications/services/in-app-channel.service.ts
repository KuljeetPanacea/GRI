import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../../core/logger/services/logger.service';
import { NotificationChannelService } from './notification-channel.service';
import { NotificationGateway } from '../gateways/notification.gateway';
import { DeliveryStatus } from '../model/notification-delivery.schema';
import { NotificationDeliveryDAO } from '../daos/notification-delivery.dao';

@Injectable()
export class InAppChannelService implements NotificationChannelService {
  private logger = LoggerService.getLogger('InAppChannelService');
  
  constructor(
    private readonly notificationGateway: NotificationGateway,
    private readonly deliveryDAO: NotificationDeliveryDAO
  ) {}
  
  async send(
    notification: any,
    content: { title?: string; content: string },
    deliveryId: string
  ): Promise<string | null> {
    try {
      // Send real-time notification via WebSocket
      this.notificationGateway.sendNotificationToUser(
        notification.userId,
        notification.tenantId,
        {
          id: notification.id,
          type: notification.type,
          title: content.title || notification.title,
          content: content.content,
          createdAt: notification.createdAt,
          priority: notification.priority
        }
      );
      
      // Mark the delivery as completed directly
      await this.deliveryDAO.update(deliveryId, {
        status: DeliveryStatus.DELIVERED,
        deliveredAt: new Date()
      });
      
      return notification.id;
    } catch (error) {
      this.logger.error(`Failed to send in-app notification ${notification.id}`, error);
      return null;
    }
  }
}