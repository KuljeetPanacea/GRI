import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { LoggerService } from 'src/core/logger';
import { TenantContext } from 'src/core/contexts/tenant.context';
import { Permissions } from 'src/core/guards/permissions.guards';
import { SystemTemplate } from './systemTemplate.service';

@Controller('system-templates')
export class SystemTemplateController {
  private logger = LoggerService.getLogger('SystemTemplateController');
  
  constructor(
    private readonly systemService: SystemTemplate
  ) {}
  
  @Get(":templateName")
  async getTemplates(@Param('templateName') templateName: string,) {
    try {
     
      return this.systemService.getTemplate(templateName);
    } catch (error) {
      this.logger.error('Failed to get templates', error);
    }
  }
  
  @Post("create-template")
  async createOrUpdateTemplate(@Body() template: {
    type: string;
    subject?: string;
    contentTemplate: string;
    titleTemplate?: string;
    active?: boolean;
  }) {
  
    try {
      const tenantId = TenantContext.getInstance().getTenantId();
      
      return this.systemService.createOrUpdateTemplate({
        ...template,
        tenantId
      });
    } catch (error) {
      this.logger.error('Failed to create or update template', error);
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
      
      const success = await this.systemService.deleteTemplate(
        type as string
      );
      
      return { success };
    } catch (error) {
      this.logger.error(`Failed to delete template ${type}/${channel}`, error);
    }
  }
}