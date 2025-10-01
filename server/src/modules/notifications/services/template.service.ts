// notifications/services/template.service.ts
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as Handlebars from 'handlebars';
import { BaseService } from 'src/core/service/base.service';
import { LoggerService } from 'src/core/logger';
import { NotificationType } from '../model/notification.schema';
import { NotificationChannel } from '../model/notification-delivery.schema';
import { Transactional } from 'src/core/decorators/transaction-decorator';
import { NotificationTemplateDAO } from '../daos/notification-template.dao';

@Injectable()
export class TemplateService extends BaseService {
  private logger = LoggerService.getLogger('TemplateService');
  private templateCache: Map<string, { template: any, timestamp: number }> = new Map();
  private CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  
  constructor(
    @InjectConnection() connection: Connection,
    private readonly templateDAO: NotificationTemplateDAO
  ) {
    super(connection);
    // Register custom Handlebars helpers
    this.registerHandlebarsHelpers();
  }
  
  /**
   * Register custom Handlebars helpers for template processing
   */
  private registerHandlebarsHelpers(): void {
    Handlebars.registerHelper('formatDate', function(date, format) {
      if (!date) return '';
      
      const d = new Date(date);
      
      if (format === 'short') {
        return d.toLocaleDateString();
      } else if (format === 'long') {
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
      } else if (format === 'relative') {
        // Simple relative time
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor(diff / (1000 * 60));
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
      }
      
      return d.toLocaleDateString();
    });
    
    Handlebars.registerHelper('uppercase', function(str) {
      if (!str) return '';
      return str.toUpperCase();
    });
    
    Handlebars.registerHelper('lowercase', function(str) {
      if (!str) return '';
      return str.toLowerCase();
    });
    
    Handlebars.registerHelper('capitalize', function(str) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    });
    
    Handlebars.registerHelper('truncate', function(str, length) {
      if (!str) return '';
      length = parseInt(length) || 30;
      if (str.length <= length) return str;
      return str.substring(0, length) + '...';
    });
    
    Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    });
    
    Handlebars.registerHelper('ifNotEquals', function(arg1, arg2, options) {
      return arg1 !== arg2 ? options.fn(this) : options.inverse(this);
    });
    
    Handlebars.registerHelper('numberFormat', function(number, decimals) {
      if (number === undefined || number === null) return '';
      decimals = decimals || 0;
      return Number(number).toFixed(decimals);
    });
  }
  
  /**
   * Process templates for all channels for a notification
   */
  async processTemplatesForNotification(
    type: NotificationType,
    data: Record<string, any>,
    tenantId: string
  ): Promise<Record<NotificationChannel, { subject?: string, title?: string, content: string }>> {
    const result: Record<NotificationChannel, { subject?: string, title?: string, content: string }> = {} as any;
    
    // Get templates for all channels
    for (const channel of Object.values(NotificationChannel)) {
      try {
        const template = await this.getTemplate(type, channel, tenantId);
        
        if (template) {
          // Process each relevant field based on channel type
          result[channel] = {
            content: this.processTemplate(template.contentTemplate, data)
          };
          
          // Add subject for email
          if (channel === NotificationChannel.EMAIL && template.subject) {
            result[channel].subject = this.processTemplate(template.subject, data);
          }
          
          // Add title if available
          if (template.titleTemplate) {
            result[channel].title = this.processTemplate(template.titleTemplate, data);
          }
          
          // Add any channel-specific processing here (e.g., WhatsApp template name)
        }
      } catch (error) {
        this.logger.error(`Error processing template for ${type}/${channel}`, error);
      }
    }
    
    return result;
  }
  
  /**
   * Get a template for a specific notification type and channel
   */
  async getTemplate(
    type: NotificationType,
    channel: NotificationChannel,
    tenantId: string
  ): Promise<any> {
    const cacheKey = `${type}:${channel}:${tenantId}`;
    
    // Check cache first
    const cached = this.templateCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      return cached.template;
    }
    
    // First try tenant-specific template
    let template = await this.templateDAO.findOne({
      type,
      channel,
      tenantId,
      active: true
    });
    
    // If no tenant template, fall back to system template
    if (!template) {
      template = await this.templateDAO.findOneWithoutTenantFilter({
        type,
        channel,
        active: true,
        tenantId: "global"
      });
    }

    // Still no template, create default for critical channels
    if (!template && (channel === NotificationChannel.EMAIL || channel === NotificationChannel.IN_APP)) {
      template = await this.createDefaultTemplate(type, channel, tenantId);
    }
    
    // Cache the template
    if (template) {
      this.templateCache.set(cacheKey, {
        template,
        timestamp: Date.now()
      });
    }
    
    return template;
  }
  
  /**
   * Process a template with the provided data
   */
  processTemplate(template: string, data: Record<string, any>): string {
    if (!template) return '';
    
    try {
      // Enrich data with additional helper variables
      const enrichedData = {
        ...data,
        _currentDate: new Date(),
        _appName: process.env.APP_NAME || 'Our Application'
      };
      
      const compiledTemplate = Handlebars.compile(template);
      return compiledTemplate(enrichedData);
    } catch (error) {
      this.logger.error(`Error compiling/rendering template: ${error.message}`, error);
      return template; // Return original as fallback
    }
  }
  
  /**
   * Create a default template for a notification type and channel
   */
  @Transactional()
  private async createDefaultTemplate(
    type: NotificationType,
    channel: NotificationChannel,
    tenantId: string
  ): Promise<any> {
    const typeName = this.getNotificationTypeName(type);
    
    let subject, titleTemplate, contentTemplate;
    
    if (channel === NotificationChannel.EMAIL) {
      subject = `Notification: ${typeName}`;
      titleTemplate = `{{_appName}} - ${typeName}`;
      contentTemplate = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">{{title}}</h2>
        <p>Hello,</p>
        <p>{{#if documentName}}A document named "{{documentName}}" has been uploaded.{{/if}}</p>
        <p>{{#if auditName}}Related to audit: {{auditName}}{{/if}}</p>
        <p>{{#if findingTitle}}Finding: {{findingTitle}}{{/if}}</p>
        <p>Please check your dashboard for more details.</p>
        <p>Thank you,<br/>{{_appName}} Team</p>
      </div>
    `;
    } else if (channel === NotificationChannel.IN_APP) {
      titleTemplate = typeName;
      contentTemplate = `
        {{#if documentName}}Document "{{documentName}}" has been uploaded.{{/if}}
        {{#if auditName}}Related to audit: {{auditName}}{{/if}}
        {{#if findingTitle}}Finding: {{findingTitle}}{{/if}}
      `;
    } else {
      return null; // No default for other channels
    }
    
    // Create and save the default template
    return this.templateDAO.create({
      tenantId,
      type,
      channel,
      subject,
      titleTemplate,
      contentTemplate,
      active: true,
      defaultMetadata: {
        isDefault: true,
        createdAt: new Date()
      }
    });
  }
  
  /**
   * Get human-readable name for notification type
   */
  private getNotificationTypeName(type: NotificationType): string {
    switch (type) {
      case NotificationType.DOCUMENT_UPLOADED:
        return 'Document Uploaded';
      case NotificationType.AUDIT_MILESTONE:
        return 'Audit Milestone';
      case NotificationType.FINDING_CREATED:
        return 'Finding Created';
      case NotificationType.TASK_ASSIGNED:
        return 'Task Assigned';
      case NotificationType.TASK_COMPLETED:
        return 'Task Completed';
      case NotificationType.COMMENT_ADDED:
        return 'Comment Added';
      case NotificationType.SYSTEM_ANNOUNCEMENT:
        return 'System Announcement';
      case NotificationType.AEPOCCreated:
        return 'User Created';
      default:
        return 'Notification';
    }
  }
  
  // CRUD operations for templates
  
  /**
   * Create or update a template
   */
  @Transactional()
  async createOrUpdateTemplate(template: {
    type: NotificationType;
    channel: NotificationChannel;
    tenantId?: string;
    subject?: string;
    contentTemplate: string;
    titleTemplate?: string;
    whatsappTemplateName?: string;
    active?: boolean;
    defaultMetadata?: Record<string, any>;
  }): Promise<any> {
    // Validate required fields for specific channels
    if (template.channel === NotificationChannel.EMAIL && !template.subject) {
      throw new Error('Subject is required for email templates');
    }
    
    if (template.channel === NotificationChannel.WHATSAPP && !template.whatsappTemplateName) {
      throw new Error('WhatsApp template name is required for WhatsApp templates');
    }
    
    // Find existing template
    const existing = await this.templateDAO.findOne({
      type: template.type,
      channel: template.channel,
      tenantId: template.tenantId || null
    });
    
    // Validate template syntax
    try {
      Handlebars.compile(template.contentTemplate);
      if (template.titleTemplate) Handlebars.compile(template.titleTemplate);
      if (template.subject) Handlebars.compile(template.subject);
    } catch (error) {
      throw new Error(`Template syntax error: ${error.message}`);
    }
    
    // Invalidate cache
    const cacheKey = `${template.type}:${template.channel}:${template.tenantId || ''}`;
    this.templateCache.delete(cacheKey);
    
    if (existing) {
      // Update
      this.logger.info(`Updating template: ${template.type}/${template.channel}/${template.tenantId || 'system'}`);
      
      return this.templateDAO.update(existing.id, {
        subject: template.subject,
        contentTemplate: template.contentTemplate,
        titleTemplate: template.titleTemplate,
        whatsappTemplateName: template.whatsappTemplateName,
        active: template.active !== undefined ? template.active : existing.active,
        defaultMetadata: template.defaultMetadata || existing.defaultMetadata,
        updateDtTime: new Date()
      });
    } else {
      // Create
      this.logger.info(`Creating template: ${template.type}/${template.channel}/${template.tenantId || 'system'}`);
      
      return this.templateDAO.create({
        type: template.type,
        channel: template.channel,
        tenantId: template.tenantId || null,
        subject: template.subject,
        contentTemplate: template.contentTemplate,
        titleTemplate: template.titleTemplate,
        whatsappTemplateName: template.whatsappTemplateName,
        active: template.active !== undefined ? template.active : true,
        defaultMetadata: template.defaultMetadata
      });
    }
  }
  
  /**
   * Get all templates for a tenant with smart grouping
   */
  async getTemplatesForTenant(tenantId: string): Promise<any> {
    // Get both tenant-specific and system templates
    const templates = await this.templateDAO.find({
      $or: [
        { tenantId },
        { tenantId: null } // System templates
      ]
    });
    
    // Group templates by type and channel for easier consumption
    const groupedTemplates = templates.reduce((result, template) => {
      const key = template.type;
      if (!result[key]) {
        result[key] = {};
      }
      
      result[key][template.channel] = template;
      return result;
    }, {});
    
    return groupedTemplates;
  }
  
  /**
   * Get template
   */
  async getTemplateById(id: string): Promise<any> {
    return this.templateDAO.findById(id);
  }
  
  /**
   * Delete a template
   */
  @Transactional()
  async deleteTemplate(
    type: NotificationType,
    channel: NotificationChannel,
    tenantId: string
  ): Promise<boolean> {
    // Find the template
    const template = await this.templateDAO.findOne({
      type,
      channel,
      tenantId
    });
    
    if (!template) {
      return false;
    }
    
    // Invalidate cache
    const cacheKey = `${type}:${channel}:${tenantId}`;
    this.templateCache.delete(cacheKey);
    
    // Delete template
    await this.templateDAO.delete(template.id);
    this.logger.info(`Deleted template: ${type}/${channel}/${tenantId || 'system'}`);
    
    return true;
  }
  
  /**
   * Test template rendering with sample data
   */
  async testTemplateRendering(
    templateId: string,
    testData: Record<string, any>
  ): Promise<{ subject?: string, title?: string, content: string }> {
    const template = await this.templateDAO.findById(templateId);
    
    if (!template) {
      throw new Error('Template not found');
    }
    
    // Process each field
    const result: { subject?: string, title?: string, content: string } = {
      content: this.processTemplate(template.contentTemplate, testData)
    };
    
    // Add subject and title if available
    if (template.subject) {
      result.subject = this.processTemplate(template.subject, testData);
    }
    
    if (template.titleTemplate) {
      result.title = this.processTemplate(template.titleTemplate, testData);
    }
    
    return result;
  }
  
  /**
   * Clear template cache
   */
  clearCache(): void {
    this.templateCache.clear();
    this.logger.info('Template cache cleared');
  }
}