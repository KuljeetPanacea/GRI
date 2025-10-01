import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type SettingDocument = Setting & Document;

@Schema() 
export class Score {
    @Prop({ required: false, ref: 'Choice', default: null })
    option?: Types.ObjectId;

    @Prop({ required: false, default: null })
    value: string;
}

@Schema()
export class Setting {
    @Prop({
        required: false,
        min: 100,
        max: 500,
    })
    characterLimit?: number;

    @Prop({
        required: false,
        default: "Explain your business type..."
    })
    placeholder?: string;

    @Prop({ required: false, default: true })
    required?: boolean;

    @Prop({ required: false, default: true })
    enableSpellCheck?: boolean;

    @Prop({ required: false, default: true })
    displayCharacterCounter?: boolean;

    @Prop({ required: false, default: true })
    autoCapitalization?: boolean;

    @Prop({ required: false })
    nextQuestion?: string;

    @Prop({ required: false, enum: ['Minimum', 'Maximum'] })
    selectionBehavior?: 'Minimum' | 'Maximum';

    @Prop({ required: false, default: 'None', enum: ['None', 'One', 'Multiple'] })
    defaultSelection?: 'None' | 'One' | 'Multiple';

    @Prop({ required: false, enum: ['Vertical', 'Horizontal'] })
    displaySettings?: 'Vertical' | 'Horizontal';

    @Prop({
        required: false,
        enum: ['Fixed Order', 'Sorting', 'Random'],
        default: 'Fixed Order'
    })
    optionOrder: 'Fixed Order' | 'Sorting' | 'Random';

    @Prop({ required: false })
    scoring: [Score];

    @Prop({ type: Types.ObjectId, ref: 'Questions', default: null })
    nextQuestionId: Types.ObjectId;
  
}

export const SettingDocument = SchemaFactory.createForClass(Setting);
