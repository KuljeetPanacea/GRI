import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TenantBaseModel } from 'src/core/model/base-model';
import { Document, Types } from 'mongoose';
import { ObjectId } from 'mongoose';
import { Setting } from './setting';
import { Question, QuestionSchema } from './Question.type';
import { flatten } from '@nestjs/common';

@Schema({ timestamps: true, collection: 'questionnaires' })
export class Questionnaire extends TenantBaseModel {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
    public tenantId: string;

  @Prop()
  description: string;
  
  @Prop({default:"Draft"})
  status:string

  @Prop({ default: false })
  isDeleted!: boolean;

  @Prop({ default: false})
  isPublished!: boolean;

  @Prop()
  version?: string;

  @Prop()
  phase: string;

  @Prop()
  publishedAt?: Date;

  @Prop()
  industrySize?: string;

  @Prop()
  complianceType?: string;

  @Prop()
  deviceType?: string;

  @Prop()
  industryType?: string;

  @Prop()
  appID?: string;

  @Prop({ default: null })
  currentQuestionTracker?: string;


  @Prop({ default: false })
  isCompletedAllQuestions?: boolean;

  @Prop({  default: null })
  parentId?: string;

  @Prop({ type: [QuestionSchema], default: [] })
  questions!: Question[];
}

export type QuestionnaireDocument = Questionnaire & Document;
export const QuestionnaireSchema = SchemaFactory.createForClass(Questionnaire);
