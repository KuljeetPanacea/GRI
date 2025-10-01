import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { BaseModel, TenantBaseModel } from "src/core/model/base-model";
import { AuditEntity } from "src/modules/project/dtos/auditEntity.dto";

@Schema()
export class Client extends TenantBaseModel {
    @Prop({ required: true, unique:true })
    public clientName: string;

    @Prop({ required: true })
    public tenantId: string;
    
    @Prop({ required: true , unique:true})
    public businessName: string;

    @Prop({ required: false, default:"Active" })
    public status: string;

    @Prop({ required: true, unique:true })
    public pocEmailId: string;

    @Prop({ required: true })
    public demography: string;

    @Prop({ required: true })
    public industry: string;
    
    @Prop({ required: true})
    public businessEntity: string;

    @Prop({ required: true })
    public entitySize: string;

    @Prop({ required: true , unique:true})
    public websiteLink: string;

    @Prop({ required: false })
    public companyLogo: string;

    @Prop({ required: true })
    public pocContactNumber: string;

    @Prop({ required: true })
    public pocName: string;

   @Prop({type:Object })
    public auditEntity: AuditEntity;

   @Prop({required: true, unique: true})
    public leadershipName: string;
    
   @Prop({required: true, unique: true})
    public leadershipContactNo: string;
    
    @Prop({required: true, unique: true})
    public leadershipEmailId: string;
}

export type ClientDocument = Client & Document;
export const ClientSchema = SchemaFactory.createForClass(Client);
