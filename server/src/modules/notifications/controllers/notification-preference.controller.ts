import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { LoggerService } from 'src/core/logger';
import { PreferenceService } from '../services/preference.service';
import { UserContext } from 'src/core/contexts/user.context';
import { TenantContext } from 'src/core/contexts/tenant.context';
import { NotificationType } from '../model/notification.schema';
import { NotificationChannel } from '../model/notification-delivery.schema';
import { NotificationFrequency } from '../model/notification-preference.schema';
import { ErrorService } from 'src/core/error/services/error.service';
// import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
// import { PreferenceService } from '../services/preference.service';
// import { LoggerService } from '../../core/logger/services/logger.service';
// import { ErrorService } from '../../core/error/services/error.service';
// import { UserContext } from '../../core/contexts/user.context';
// import { TenantContext } from '../../core/contexts/tenant.context';
// import { NotificationType } from '../schemas/notification.schema';
// import { NotificationChannel } from '../schemas/notification-delivery.schema';
// import { NotificationFrequency } from '../schemas/notification-preference.schema';

@Controller('notification-preferences')
@UseGuards(JwtAuthGuard)
export class NotificationPreferenceController {
  private logger = LoggerService.getLogger('NotificationPreferenceController');
  
  constructor(
    private readonly preferenceService: PreferenceService,
    private readonly errorService: ErrorService
  ) {}
  
  /**
   * Get all preferences for current user
   */
  @Get()
  async getPreferences() {
    try {
      const userId = UserContext.getInstance().getUserId();
      const tenantId = TenantContext.getInstance().getTenantId();
      
      return this.preferenceService.getUserPreferences(userId, tenantId);
    } catch (error) {
      this.logger.error('Failed to get preferences', error);
      throw this.errorService.mapError(error);
    }
  }

  @Post('bulk')
  async bulkUpdatePreferences(@Body() preferences: Array<{
    notificationType: NotificationType;
    channels: NotificationChannel[];
    frequency: NotificationFrequency;
    enabled: boolean;
    highPriorityOverride?: boolean;
  }>) {
    try {
      const userId = UserContext.getInstance().getUserId();
      const tenantId = TenantContext.getInstance().getTenantId();
      
      await this.preferenceService.bulkUpdatePreferences(userId, preferences, tenantId);
      
      return { success: true };
    } catch (error) {
      this.logger.error('Failed to bulk update preferences', error);
      throw this.errorService.mapError(error);
    }
  }

  /**
   * Update a preference
   */
  @Post()
  async updatePreference(@Body() preference: {
    notificationType: NotificationType;
    channels: NotificationChannel[];
    frequency: NotificationFrequency;
    enabled: boolean;
    highPriorityOverride?: boolean;
    quietHoursEnabled?: boolean;
    quietHoursStart?: string;
    quietHoursEnd?: string;
    timezone?: string;
  }) {
    try {
      const userId = UserContext.getInstance().getUserId();
      const tenantId = TenantContext.getInstance().getTenantId();
      
      return this.preferenceService.updateUserPreference(userId, preference, tenantId);
    } catch (error) {
      this.logger.error('Failed to update preference', error);
      throw this.errorService.mapError(error);
    }
  }
  
  /**
   * Bulk update preferences
   */
  
}