import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TenantBaseModel } from 'src/core/model/base-model';

import { BusinessOverviewDataDTO } from '../dtos/business-overview-data.dto';
import { ScopeOfWorkDataDTO } from '../dtos/scope-of-work-data.dto';
import { ReviewedEnvDataDTO } from '../dtos/reviewed-env-data.dto';
import {ContactInfoDataDTO} from '../dtos/contact-info-data.dto';
import { QuarterlyScanFormDataDTO } from '../dtos/quarterly-scan-form-data.dto';


@Schema({collection:'roc-data-partone'})
export class RocPartOne extends TenantBaseModel {
  @Prop({ type: Object })
  businessOverview: BusinessOverviewDataDTO;

  @Prop({ type: Object })
  scopeOfWork: ScopeOfWorkDataDTO;

  @Prop({ type: Object })
  reviewedEnv: ReviewedEnvDataDTO;

  @Prop({ type: Object })
  contactInfo: ContactInfoDataDTO;

  @Prop({ type: Object })
  quarterlyScan: QuarterlyScanFormDataDTO;

  @Prop()
  projectId: string;

  @Prop({ type: String })
  id: string;
}

export type RocPartOneDocument = RocPartOne & Document;
export const RocPartOneSchema = SchemaFactory.createForClass(RocPartOne);
