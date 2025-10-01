import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { SharedBaseModel } from "src/core/model/base-model";

export interface LookupValue {
    code: string;
    name: string;
  }

@Schema()
export class Lookup extends SharedBaseModel {
    @Prop()
    lookUpId: string;
  
    @Prop({ required: true })
    category: string;
  
    @Prop({
      type: [
        {
          code: { type: String, required: true },
          name: { type: String, required: true },
          value: { type: String, required: false },
        },
      ],
      default: [],
    })
    values: LookupValue[];
  }

export type LookupDocument = Lookup & Document;
export const LookupSchema = SchemaFactory.createForClass(Lookup);
