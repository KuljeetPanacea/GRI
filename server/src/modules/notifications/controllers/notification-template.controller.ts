import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { LoggerService } from 'src/core/logger';
import { TemplateService } from '../services/template.service';
import { TenantContext } from 'src/core/contexts/tenant.context';
import { Permissions } from 'src/core/guards/permissions.guards';
import { NotificationType } from '../model/notification.schema';
import { NotificationChannel } from '../model/notification-delivery.schema';
import { ErrorService } from 'src/core/error/services/error.service';
// import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
// import { TemplateService } from '../services/template.service';
// import { LoggerService } from '../../core/logger/services/logger.service';
// import { ErrorService } from '../../core/error/services/error.service';
// import { TenantContext } from '../../core/contexts/tenant.context';
// import { NotificationType } from '../schemas/notification.schema';
// import { NotificationChannel } from '../schemas/notification-delivery.schema';
// import { Permissions } from '../../core/decorators/access-control.decorators';

@Controller('notification-templates')
@UseGuards(JwtAuthGuard)
export class NotificationTemplateController {
  private logger = LoggerService.getLogger('NotificationTemplateController');
  
  constructor(
    private readonly templateService: TemplateService,
    private readonly errorService: ErrorService
  ) {}
  
  /**
   * Get all templates for current tenant
   */
  @Get()
  async getTemplates() {
    try {
      const tenantId = TenantContext.getInstance().getTenantId();
      
      return this.templateService.getTemplatesForTenant(tenantId);
    } catch (error) {
      this.logger.error('Failed to get templates', error);
      throw this.errorService.mapError(error);
    }
  }
  
  /**
   * Create or update a template
   */
  @Post("create-template")
  async createOrUpdateTemplate(@Body() template: {
    type: NotificationType;
    channel: NotificationChannel;
    subject?: string;
    contentTemplate: string;
    titleTemplate?: string;
    whatsappTemplateName?: string;
    active?: boolean;
  }) {
  
    try {
      const tenantId = TenantContext.getInstance().getTenantId();
      
      return this.templateService.createOrUpdateTemplate({
        ...template,
        tenantId
      });
    } catch (error) {
      this.logger.error('Failed to create or update template', error);
      throw this.errorService.mapError(error);
    }
  }
  
  /**
   * Delete a template
   */
  @Delete(':type/:channel')
  @Permissions('notifications:manage-templates')
  async deleteTemplate(
    @Param('type') type: string,
    @Param('channel') channel: string
  ) {
    try {
      const tenantId = TenantContext.getInstance().getTenantId();
      
      const success = await this.templateService.deleteTemplate(
        type as NotificationType,
        channel as NotificationChannel,
        tenantId
      );
      
      return { success };
    } catch (error) {
      this.logger.error(`Failed to delete template ${type}/${channel}`, error);
      throw this.errorService.mapError(error);
    }
  }
}