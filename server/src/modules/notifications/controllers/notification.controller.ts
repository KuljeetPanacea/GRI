import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { LoggerService } from 'src/core/logger';
import { NotificationService } from '../services/notification.service';
import { UserContext } from 'src/core/contexts/user.context';
import { TenantContext } from 'src/core/contexts/tenant.context';
import { NotificationType } from '../model/notification.schema';
import { ErrorService } from 'src/core/error/services/error.service';
// import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
// import { NotificationService } from '../services/notification.service';
// import { LoggerService } from '../../core/logger/services/logger.service';
// import { ErrorService } from '../../core/error/services/error.service';
// import { UserContext } from '../../core/contexts/user.context';
// import { TenantContext } from '../../core/contexts/tenant.context';
// import { NotificationType } from '../schemas/notification.schema';
// import { Permissions } from '../../core/decorators/access-control.decorators';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  private logger = LoggerService.getLogger('NotificationController');
  
  constructor(
    private readonly notificationService: NotificationService,
    private readonly errorService: ErrorService
  ) {}
  
  private parseBoolean(str: string): boolean {
    return str.toLowerCase() === 'true';
  }
  /**
   * Get notifications for current user
   */
  @Get()
  async getNotifications(
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
    @Query('read') read?: string,  // <-- change here
    @Query('types') types?: string
  ) {
    try {
      const userId = UserContext.getInstance().getUserId();
      const tenantId = TenantContext.getInstance().getTenantId();
      
      const typesArray: NotificationType[] | undefined = types
        ? types.split(',') as NotificationType[]
        : undefined;
  
      const isRead: boolean | undefined = 
        read !== undefined ? read.toLowerCase() === 'true' : undefined;
  
      return this.notificationService.getNotifications(
        userId,
        tenantId,
        {
          page: page ? parseInt(page.toString(), 10) : 1,
          perPage: perPage ? parseInt(perPage.toString(), 10) : 20,
          read: isRead,
          types: typesArray,
        }
      );
    } catch (error) {
      this.logger.error('Failed to get notifications', error);
      throw this.errorService.mapError(error);
    }
  }
  
  
  /**
   * Get unread notification count
   */
  @Get('unread-count')
  async getUnreadCount() {
    try {
      const userId = UserContext.getInstance().getUserId();
      const tenantId = TenantContext.getInstance().getTenantId();
      
      const count = await this.notificationService.getUnreadCount(userId, tenantId);
      
      return { count };
    } catch (error) {
      this.logger.error('Failed to get unread count', error);
      throw this.errorService.mapError(error);
    }
  }
  
  /**
   * Mark notification as read
   */
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    try {
      const userId = UserContext.getInstance().getUserId();
      
      const success = await this.notificationService.markAsRead(id, userId);
      
      return { success };
    } catch (error) {
      this.logger.error(`Failed to mark notification ${id} as read`, error);
      throw this.errorService.mapError(error);
    }
  }
  
  /**
   * Mark all notifications as read
   */
  @Post('mark-all-read')
  async markAllAsRead() {
    try {
      // Implementation would go here
      return { success: true };
    } catch (error) {
      this.logger.error('Failed to mark all notifications as read', error);
      throw this.errorService.mapError(error);
    }
  }
  
  /**
   * Delete notification
   */
  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    try {
      // Implementation would go here
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to delete notification ${id}`, error);
      throw this.errorService.mapError(error);
    }
  }
}