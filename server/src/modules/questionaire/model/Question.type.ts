import { Types, Document, Schema as MongooseSchema  } from 'mongoose';
import { Prop, SchemaFactory,Schema } from '@nestjs/mongoose';
import { BranchingLogic } from './branching-logic.interface';

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  SHORT_TEXT = 'short_text',
  LONG_TEXT = 'long_text',
  SINGLE_CHOICE = 'single_choice',
  FILE_TYPE = 'file_type',
  TABLE_TYPE = 'table_type',
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

  // Unified table properties
  @Prop({ 
    type: {
      mode: { type: String, enum: ['dynamic', 'template'], default: 'dynamic' },
      rows: [{
        id: { type: String, required: true },
        label: { type: String, required: true }
      }],
      columns: [{
        id: { type: String, required: true },
        label: { type: String, required: true },
        type: { type: String, enum: ['text', 'number', 'date', 'select', 'checkbox'], required: true },
        options: { type: [String], default: [] },
        validation: {
          min: { type: Number },
          max: { type: Number },
          pattern: { type: String }
        }
      }]
    },
    required: false 
  })
  tableConfig?: {
    mode: 'dynamic' | 'template';
    rows?: Array<{
      id: string;
      label: string;
    }>;
    columns: Array<{
      id: string;
      label: string;
      type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
      options?: string[];
      validation?: {
        min?: number;
        max?: number;
        pattern?: string;
      };
    }>;
  };

  @Prop({ type: [Object], default: [] })
  tableData?: Record<string, any>[];

}

export type QuestionDocument = Question & Document;
export const QuestionSchema = SchemaFactory.createForClass(Question);
