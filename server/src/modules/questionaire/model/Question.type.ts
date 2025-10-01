import { Types, Document, Schema as MongooseSchema  } from 'mongoose';
import { Prop, SchemaFactory,Schema } from '@nestjs/mongoose';
import { BranchingLogic } from './branching-logic.interface';

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  SHORT_TEXT = 'short_text',
  LONG_TEXT = 'long_text',
  SINGLE_CHOICE = 'single_choice',
  FILE_TYPE = 'file_type',
}

@Schema({ _id: false })
export class Question {
    @Prop({ type: Types.ObjectId, auto: true })
    _id: Types.ObjectId;

  @Prop({ type: String, required: true, enum: QuestionType })
  type: QuestionType;

  @Prop({ type: String, required: true })
  text: string;
  
  @Prop({ type: String })
  userResponse: string;

  @Prop({ type: [{ value: { type: String, required: true } }], default: [] })
  choices: Array<{ value: string }>;

  @Prop({ type: Boolean, default: false })
  isEditing: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Object, default: [] })
  branchingLogic?: BranchingLogic;

  @Prop({ type: Object, default: [] })
  formBranchingLogic?: BranchingLogic[];

  @Prop({ type: Types.ObjectId, ref: 'Question', default: null })
  alwaysGoTo?: Types.ObjectId | null;

  @Prop({ type: Object, default: {} })
  setting?: any;

  @Prop({ type: Object, required: false })
  requirements?: any;

  @Prop({ type: Object, required: false })
  subRequirements?: any;

  @Prop({ type: Object, required: false })
  subControl?: any;

  @Prop({ type: String, required: false })
  evidenceReference?: string;

  @Prop({ type: String, required: false })
  testingProcedure?: string;

  @Prop({ 
    type: {
      gaps: { type: String, required: false },
      clientComment: { type: String, required: false },
      status: { type: String, required: false, default: "Finding Open" }
    }, 
    required: false 
  })
  gaps?: {
    gaps?: string;
    clientComment?: string;
    status?: string;
  };

}

export type QuestionDocument = Question & Document;
export const QuestionSchema = SchemaFactory.createForClass(Question);
