import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { TenantBaseModel } from "src/core/model/base-model";
import { QuestionnaireDto } from "src/modules/questionaire/dto/questionnaire.dto";
import { EvidenceDto } from "../dtos/assessmentTask.dto";

@Schema()
export class AssessmentTask extends TenantBaseModel {
  @Prop({ required: true })
  public deviceRefName: string;

  @Prop({ required: true })
  public deviceType: string;

  @Prop()
  public questionnaire?: QuestionnaireDto;

  @Prop({ required: false })
  public department?: string;

  @Prop({required: false })
  public primaryAEStakeholder?: string;
  
  @Prop({required: false })
  public primaryAEStakeholderId?: string;

  @Prop({ required: false })
  public ipAddress?: string;

  @Prop({ required: true })
  public projectId: string;

  @Prop({ default: false })
  public emailSent?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvidenceDto)
  @IsOptional()
  @Prop({ required: false })
  evidences?: EvidenceDto[];

}

export type AssessmentTaskDocument = AssessmentTask & Document;
export const AssessmentTaskSchema = SchemaFactory.createForClass(AssessmentTask);
