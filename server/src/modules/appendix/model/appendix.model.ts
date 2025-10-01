import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { Document } from "mongoose";
import { TenantBaseModel } from "src/core/model/base-model";
import { AppendixAControlDto } from "../dtos/appendix-a.dto";

@Schema({ collection: 'roc-data-appendix' })
export class Appendix extends TenantBaseModel {
  @Prop({ required: true })
  public appendixType: string; // 'appendix-a', 'appendix-c', 'appendix-e'

  @Prop({ required: true })
  public projectId: string;

  // Appendix A specific fields
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AppendixAControlDto)
  @IsOptional()
  @Prop({ required: false, type: [Object] })
  public controls?: AppendixAControlDto[];

  // Appendix C specific fields
  @IsOptional()
  @Prop({ required: false })
  public requirementNumber?: string;

  @IsOptional()
  @Prop({ required: false })
  public requirementDefinition?: string;

  @IsOptional()
  @Prop({ required: false })
  public constraints?: string;

  @IsOptional()
  @Prop({ required: false })
  public compensatingControlsDefinition?: string;

  @IsOptional()
  @Prop({ required: false })
  public originalObjective?: string;

  @IsOptional()
  @Prop({ required: false })
  public compensatingObjective?: string;

  @IsOptional()
  @Prop({ required: false })
  public identifiedRisk?: string;

  @IsOptional()
  @Prop({ required: false })
  public validationMethod?: string;

  @IsOptional()
  @Prop({ required: false })
  public maintenanceProcess?: string;

  // Appendix E specific fields
  @IsOptional()
  @Prop({ required: false })
  public customizedControlName?: string;

  @IsOptional()
  @Prop({ required: false })
  public controlDescription?: string;

  @IsOptional()
  @Prop({ required: false })
  public objectiveMeeting?: string;

  @IsOptional()
  @Prop({ required: false })
  public controlsMatrixDocumentation?: string;

  @IsOptional()
  @Prop({ required: false })
  public targetedRiskAnalysis?: string;

  @IsOptional()
  @Prop({ required: false })
  public assessorNames?: string;

  @IsOptional()
  @Prop({ required: false })
  public testingProcedure1?: string;

  @IsOptional()
  @Prop({ required: false })
  public whatTested1?: string;

  @IsOptional()
  @Prop({ required: false })
  public evidenceExamined1?: string;

  @IsOptional()
  @Prop({ required: false })
  public testingResults1?: string;

  @IsOptional()
  @Prop({ required: false })
  public testingProcedure2?: string;

  @IsOptional()
  @Prop({ required: false })
  public whatTested2?: string;

  @IsOptional()
  @Prop({ required: false })
  public evidenceExamined2?: string;

  @IsOptional()
  @Prop({ required: false })
  public testingResults2?: string;
}

export type AppendixDocument = Appendix & Document;
export const AppendixSchema = SchemaFactory.createForClass(Appendix);