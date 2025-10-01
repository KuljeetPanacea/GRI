import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { LoggerService } from "src/core/logger";
import { SystemTemplateDAO } from "./systemTemplate.dao";
import { BaseService } from "src/core/service/base.service";
import { Transactional } from "src/core/decorators/transaction-decorator";

@Injectable()
export class SystemTemplate extends BaseService {

    private logger = LoggerService.getLogger('PreferenceService');
      
    constructor(
    @InjectConnection() connection: Connection,
    private readonly systemTemplate: SystemTemplateDAO
    ) {
    super(connection)
    }

    async getTemplate(name: string): Promise<any> {
    const templates = await this.systemTemplate.findOne({type:name});
    
    return templates;
    }
      
    async getTemplateById(id: string): Promise<any> {
    return this.systemTemplate.findById(id);
    }
      
     
    @Transactional()
    async deleteTemplate(
    type: string,
    ): Promise<boolean> {
    // Find the template
    const template = await this.systemTemplate.findOne({
        type
    });
    
    if (!template) {
        return false;
    }

    return true;
    }

    @Transactional()
      async createOrUpdateTemplate(template: {
        type: string;
        tenantId?: string;
        subject?: string;
        contentTemplate: string;
        titleTemplate?: string;
        active?: boolean;
        defaultMetadata?: Record<string, any>;
      }): Promise<any> {
      
        const existing = await this.systemTemplate.findOne({
          type: template.type
        });
        
        if (existing) {
          // Update
          this.logger.info(`Updating template: ${template.type}/${template.tenantId || 'system'}`);
          
          return this.systemTemplate.update(existing.id, {
            subject: template.subject,
            contentTemplate: template.contentTemplate,
            titleTemplate: template.titleTemplate,
            active: template.active !== undefined ? template.active : existing.active,
            defaultMetadata: template.defaultMetadata || existing.defaultMetadata,
            updateDtTime: new Date()
          });
        } else {
          // Create
          this.logger.info(`Creating template: ${template.type}/${template.tenantId || 'system'}`);
          
          return this.systemTemplate.create({
            type: template.type,
            subject: template.subject,
            contentTemplate: template.contentTemplate,
            titleTemplate: template.titleTemplate,
            active: template.active !== undefined ? template.active : true,
            defaultMetadata: template.defaultMetadata
          });
        }
      }
      
}
