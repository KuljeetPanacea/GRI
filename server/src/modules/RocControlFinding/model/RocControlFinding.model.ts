import { Schema, SchemaFactory, Prop, raw } from "@nestjs/mongoose";
import { TenantBaseModel } from "src/core/model/base-model";
import { EvidenceDto } from "src/modules/assessmentTask/dtos/assessmentTask.dto";

export enum ControlFinding {
  IN_PLACE = 'In Place',
  NOT_IN_PLACE = 'Not in Place',
  NOT_TESTED = 'Not Tested',
  NOT_APPLICABLE = 'Not Applicable'
}

export const CustomizedEnum = ['yes', 'no'] as const;
type CustomizedEnumType = (typeof CustomizedEnum)[number];

export const ModeEnum = ['Remote', 'In Place', 'Hybrid'] as const;
export type ModeEnumType = (typeof ModeEnum)[number];

@Schema()
export class RocControlFinding extends TenantBaseModel {

  @Prop({ required: true })
  public projectId: string;

  @Prop({ required: true })
  public assessmentId: string;


  @Prop({ required: true, unique:true})
  public controlNo: string;

  @Prop({
    required: true,
    enum: ControlFinding,
    type: String,
  })
  public controlAssessmentFinding: ControlFinding;

  @Prop({ required: true, unique: false })
  public detailed_finding: string;

  // @Prop(raw({
  //   name: { type: String, required: true },
  //   customized: { type: String, enum: CustomizedEnum, required: true },
  //   customised_approach: { type: String, required: true },
  //   define: { type: String, enum: CustomizedEnum, required: true },
  //   define_approach:  { type: String, required: true }
  // }))
  // public validationMethod: {
  //   name: string;
  //   customized: CustomizedEnumType;
  //   customised_approach: string;
  //   define:CustomizedEnumType;
  //   define_approach: string
  // };

  @Prop()
  public compensatingControl: boolean;

  @Prop()
  public customizedApproach: boolean;

  @Prop()
  public evidences: EvidenceDto[];

  @Prop(raw({
    mode: { type: String, enum: ModeEnum, required: true },
    compensation: { type: String, required: true },
  }))
  public modeOfAssessment: {
    mode: ModeEnumType;
    compensation: string;
  };
}

export type RocControlFindingDocument = RocControlFinding & Document;
export const RocControlFindingSchema = SchemaFactory.createForClass(RocControlFinding);
