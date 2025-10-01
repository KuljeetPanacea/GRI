
import { Document } from "mongoose";
import { Prop, Schema } from "@nestjs/mongoose";
@Schema({
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` timestamps
    versionKey: "__v", // Use `__v` for MongoDB versioning
})
export abstract class BaseModel extends Document {
  @Prop({ default: Date.now })
  public createDtTime?: Date; // Date of creation

  @Prop()
  public updateDtTime?: Date; // Date of last update

  @Prop({ required: true })
  public createdBy: string;
  
  @Prop()
  public updatedBy?: string;

  @Prop()
  public __v?: number; // Version field for optimistic concurrency control
}


// Tenant-specific model base
export abstract class TenantBaseModel extends BaseModel {
  @Prop({ required: true, index: true })
  public tenantId: string;
}

// Shared across tenants model base

export abstract class SharedBaseModel extends BaseModel {
  // No tenantId field
}

// System-level model base

export abstract class SystemBaseModel extends BaseModel {
  // No tenantId field
}