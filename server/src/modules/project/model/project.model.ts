import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { TenantBaseModel } from "src/core/model/base-model";
import { AuditEntity } from "../dtos/auditEntity.dto";
import { device } from "../dtos/device.dto";
import { UserDTO } from "src/modules/user/dtos/User.dto";
import { assignedEntity } from "../dtos/assignedEntity.dto";
import { aeInternalAssessor } from "../dtos/aeInternalAssessor.dto";
import { cdeDocument } from "../dtos/cdeDocx";

@Schema()
export class Project extends TenantBaseModel {
    @Prop({ required: true })
    public projectName: string;
  
    @Prop({ required: true })
    public description: string;
  
    @Prop({ type: Date })
    public startDate: Date;
  
    @Prop({  type: Date })
    public endDate: Date;
  
    @Prop({type:Object })
    public client: Object;

    @Prop({type:Object })
    public Auditor: Object;
    @Prop({type:Object })
    public ScopeDocument: Object;

    @Prop({type:Object })
    public QA: Object;

    @Prop({type:Object })
    public auditEntity: AuditEntity;

    @Prop({ required: true })
    public currentAuditStage: string;
  
    @Prop({ required: true })
    public createdBy: string;

    @Prop({required: true})
    public status: string;

    @Prop({type:Array })
    public scopingQSTRNR?: Object[];

    @Prop()
    public fileName?: string;
  
    @Prop()
    public filePath?: string;
  
    @Prop()
    public documentType?: string;

    @Prop()
    clientDBA?: string;
    
    @Prop()
    clientWebsiteLink?: string;
    
    @Prop()
    clientPocName?: string;
    
    @Prop()
    clientContactNumber?: string;
    
    @Prop()
    clientEmailAddress?: string;

    @Prop()
    createdByEmail?: string;

    @Prop()
    createdByName?: string;

    @Prop({type:Array })
    public device?: device[];

    @Prop({type:Array })
    public AEStakeholders?: UserDTO[];

    @Prop({type:Array})
    public assignedTo?: assignedEntity[];

    @Prop({type:Array})
    public aeInternalAssessors?: aeInternalAssessor[];

    @Prop({type:Array})
    public cdeDocs?: cdeDocument[]


}

export type ProjectDocument = Project & Document;
export const ProjectSchema = SchemaFactory.createForClass(Project);
