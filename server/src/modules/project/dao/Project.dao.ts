import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Project } from "../model/project.model";
import { IProjectDAO } from "./project-dao.interface";
import { ProjectDTO } from "../dtos/project.dto";
import { TenantDAO } from "src/core/dao/base-tenant.dao";
import { adminProjectResponse } from "../dtos/adminProjectResponse.dto";
import {
  QueryOptions,
} from "src/core/database/query-options.interface";

@Injectable()
export class ProjectDAO extends TenantDAO<Project, ProjectDTO> implements IProjectDAO {
  constructor(
    @InjectModel(Project.name) private readonly ProjectModel: Model<Project>
  ) {
    super(ProjectModel, ProjectDTO);
  }

  async findByEmail(email: string): Promise<Project | null> {
    return this.model.findOne({ email }).exec();
  }

async findAllForAdmin(filter: any, options: QueryOptions): Promise<adminProjectResponse[]> {
  // Define the specific fields needed for admin response
  const adminSelectFields = [
    'projectName',
    'description', 
    'status',
    'assignedTo',
    'auditEntity',
    'client',
    'currentAuditStage',
    'startDate',
    'endDate',
    'scopingQSTRNR',
    'clientInfo',
    '_id',
    'tenantId',
    'createDtTime',
    'updateDtTime'
  ];

  const mergedOptions: QueryOptions = {
    ...options,
    select: adminSelectFields
  };

  // Use find method with filter and options separately (like the working client example)
  const projects = await this.find(filter, mergedOptions);

  // Transform to admin response format
  return this.modelToDTOArrayForAdmin(projects);
}

  /**
   * Fetch paginated, filtered, and searched devices for a project
   */
  async getPaginatedDevices(
    projectId: string,
    options: { page?: number; limit?: number; search?: string; deviceType?: string; department?: string }
  ): Promise<{ devices: any[]; currentPage: number; totalPages: number; totalCount: number }> {
    const { page = 1, limit = 10, search = '', deviceType, department } = options;
    const project = await this.model.findById(projectId).lean();
    if (!project || !Array.isArray(project.device)) {
      return { devices: [], currentPage: 1, totalPages: 0, totalCount: 0 };
    }
    let filtered = project.device;
    // Filter by deviceType
    if (deviceType && deviceType !== 'All') {
      filtered = filtered.filter((d: any) => d.deviceType === deviceType);
    }
    // Filter by department
    if (department) {
      filtered = filtered.filter((d: any) => d.department === department);
    }
    // Search by deviceRefName (case-insensitive)
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter((d: any) =>
        (d.deviceRefName && d.deviceRefName.toLowerCase().includes(s)) ||
        (d.deviceType && d.deviceType.toLowerCase().includes(s)) ||
        (d.department && d.department.toLowerCase().includes(s))
      );
    }
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const start = (page - 1) * limit;
    const end = start + limit;
    const devices = filtered.slice(start, end);
    return { devices, currentPage: page, totalPages, totalCount };
  }

  /**
   * Delete a device from a project by projectId and deviceRefName
   */
  async deleteDeviceFromProject(projectId: string, deviceRefName: string): Promise<boolean> {
    const project = await this.model.findById(projectId);
    if (!project || !Array.isArray(project.device)) {
      return false;
    }
    const originalLength = project.device.length;
    project.device = project.device.filter((d: any) => d.deviceRefName !== deviceRefName);
    if (project.device.length === originalLength) {
      // No device was removed
      return false;
    }
    await project.save();
    return true;
  }

  protected modelToDTO(model: Project | null): ProjectDTO | null {
    if (!model) return null;
  
    const projectDTO = new ProjectDTO();
    projectDTO.projectName = model.projectName;
    projectDTO.description = model.description;
    projectDTO.startDate = model.startDate;
    projectDTO.endDate = model.endDate;
    projectDTO.clientInfo = model.client
    projectDTO.createdBy = model.createdBy;
    projectDTO.status = model.status;
    projectDTO.tenantId = model.tenantId;
    projectDTO._id = model.id;
    projectDTO.__v = model.__v;
    projectDTO.auditEntity = model.auditEntity;
    projectDTO.scopingQSTRNRData = model.scopingQSTRNR;
    projectDTO.id = model._id.toString();
    projectDTO.currentAuditStage = model.currentAuditStage;
    projectDTO.clientDBA = model.clientDBA;
    projectDTO.clientWebsiteLink = model.clientWebsiteLink;
    projectDTO.clientPocName = model.clientPocName;
    projectDTO.clientContactNumber = model.clientContactNumber;
    projectDTO.clientEmailAddress = model.clientEmailAddress;
    projectDTO.updateDtTime = model.updateDtTime; 
    projectDTO.createDtTime = model.createDtTime; 
    projectDTO.device = model.device;
    projectDTO.AEStakeholders = model.AEStakeholders;
    projectDTO.assignedTo = model.assignedTo;
    projectDTO.aeInternalAssessors = model.aeInternalAssessors;
    projectDTO.cdeDocs = model.cdeDocs;
    projectDTO.createdByName = model.createdByName;
    projectDTO.createdByEmail = model.createdByEmail;
    projectDTO.ScopeDocument = model.ScopeDocument;
    return projectDTO;
  }
  
  protected modelToDTOArray(models: Project[]): ProjectDTO[] {
    return models.map(model => this.modelToDTO(model)!);
  }

  private modelToDTOArrayForAdmin(projectDTOs: ProjectDTO[]): adminProjectResponse[] {
    return projectDTOs.map(dto => this.modelToDTOForAdmin(dto));
  }

  private modelToDTOForAdmin(projectDTO: ProjectDTO): adminProjectResponse {
    const adminResponse = new adminProjectResponse();
    
    // Map basic fields
    adminResponse.projectId = projectDTO.id || projectDTO._id?.toString();
    adminResponse.projectName = projectDTO.projectName;
    adminResponse.description = projectDTO.description;
    adminResponse.status = projectDTO.status;
    adminResponse.currentAuditStage = projectDTO.currentAuditStage;
    adminResponse.startDate = projectDTO.startDate;
    adminResponse.endDate = projectDTO.endDate;
    adminResponse.auditEntity = projectDTO.auditEntity;
    adminResponse.assignedTo = projectDTO.assignedTo;
    adminResponse.clientInfo = projectDTO.clientInfo;

    // Handle client field (adjust based on your clientInfo structure)
    adminResponse.client = this.extractClientName(projectDTO.clientInfo);

    // Extract only titles from scopingQSTRNR array
    adminResponse.scopingQSTRNR = this.extractScopingTitles(projectDTO.scopingQSTRNRData);

    // Map base DTO fields
    adminResponse._id = projectDTO._id;
    adminResponse.createDtTime = projectDTO.createDtTime;
    adminResponse.updateDtTime = projectDTO.updateDtTime;

    return adminResponse;
  }

  private extractClientName(clientInfo: any): string {
    if (!clientInfo) return '';
    
    // Adjust this logic based on your clientInfo structure
    if (typeof clientInfo === 'string') return clientInfo;
    if (clientInfo.name) return clientInfo.name;
    if (clientInfo.clientName) return clientInfo.clientName;
    
    return JSON.stringify(clientInfo); // fallback
  }

  // Helper method to extract scoping titles
  private extractScopingTitles(scopingData: any[]): string[] {
    if (!scopingData || !Array.isArray(scopingData)) return [];
    
    return scopingData
      .map(item => item?.id)
      .filter(title => title && typeof title === 'string');
  }
  
  protected dtoToModel(dto: Partial<ProjectDTO>): Partial<Project> {
    if (!dto) return {};
  
    const projectModel: Partial<Project> = {};
  
    if (dto.projectName !== undefined) projectModel.projectName = dto.projectName;
    if (dto.description !== undefined) projectModel.description = dto.description;
    if (dto.startDate !== undefined) projectModel.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined) projectModel.endDate = new Date(dto.endDate);
    if (dto.clientInfo !== undefined) {
      projectModel.client = dto.clientInfo;
    }
    if (dto.auditEntity !== undefined) {
      projectModel.auditEntity = dto.auditEntity;
    }
  
    if (dto.currentAuditStage !== undefined) projectModel.currentAuditStage = dto.currentAuditStage;
    if (dto.createdBy !== undefined) projectModel.createdBy = dto.createdBy;
    if (dto.status !== undefined) projectModel.status = dto.status;
    if (dto.tenantId !== undefined) projectModel.tenantId = dto.tenantId;
    if (dto.scopingQSTRNRData !== undefined) projectModel.scopingQSTRNR = dto.scopingQSTRNRData;
    

    if (dto.clientDBA !== undefined) projectModel.clientDBA = dto.clientDBA;
    if (dto.clientWebsiteLink !== undefined) projectModel.clientWebsiteLink = dto.clientWebsiteLink;
    if (dto.clientPocName !== undefined) projectModel.clientPocName = dto.clientPocName;
    if (dto.clientContactNumber !== undefined) projectModel.clientContactNumber = dto.clientContactNumber;
    if (dto.clientEmailAddress !== undefined) projectModel.clientEmailAddress = dto.clientEmailAddress;
  if(dto.ScopeDocument !== undefined) projectModel.ScopeDocument = dto.ScopeDocument;
    if (dto.device !== undefined) {
      projectModel.device = dto.device;
    }

    if(dto.AEStakeholders !== undefined){
      projectModel.AEStakeholders = dto.AEStakeholders;
    }

    if(dto.assignedTo !== undefined){
      projectModel.assignedTo = dto.assignedTo;
    }

    if(dto.aeInternalAssessors !== undefined){
      projectModel.aeInternalAssessors = dto.aeInternalAssessors;
    }

    if (dto.cdeDocs !== undefined) projectModel.cdeDocs = dto.cdeDocs;

    if(dto.createdByName !== undefined) projectModel.createdByName = dto.createdByName;
    if(dto.createdByEmail !== undefined) projectModel.createdByEmail = dto.createdByEmail;

    return projectModel;
  }

  protected isTenantEntity(): boolean {
    return true;
  }
  
  protected isSharedEntity(): boolean{
    return false;
  }
  
  protected isSystemEntity(): boolean {
    return false;
  }

}

