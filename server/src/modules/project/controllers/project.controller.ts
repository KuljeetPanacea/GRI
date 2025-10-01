import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProjectService } from "../service/project.service";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { PermissionsGuard } from "src/core/guards/permissions.guards";
import { ProjectDTO } from "../dtos/project.dto";
import { Permissions } from "src/core/guards/permissions.guards";
import { UpdateProjectDto, userResponseDto, gapCommentDto } from "../dtos/updateProject.dto";
import { UploadDocumentDTO } from "../dtos/uploadDocuments.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { QueryOptions } from "src/core/database/query-options.interface";
import { ProjectResponseDTO, ProjectUpdateResponseDTO } from "../dtos/projectCreateResponse.dto";
import { AuditEntity } from "../dtos/auditEntity.dto";
import { cdeDocument, cdeDocx } from "../dtos/cdeDocx";
import { aestakeholder } from "../dtos/aestakeholder.dto";
import { adminProjectResponse } from "../dtos/adminProjectResponse.dto";
@Controller("project") // This sets the base route for the controller
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Permissions("ProjectManagement")
  @Post("createproject")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async createProject(@Body() projectDTO: ProjectDTO): Promise<ProjectResponseDTO> {
    return await this.projectService.createProject(projectDTO);
  }

  @Permissions("ProjectManagement")
  @Patch("updateproject/:id")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async updateProject(
    @Param("id") id: string, 
    @Body() projectDTO: UpdateProjectDto
  ): Promise<ProjectUpdateResponseDTO> {
    return await this.projectService.updateProject(id, projectDTO);
  }

  @Permissions("ProjectManagement")
  @Delete("deleteproject/:id")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async deleteProject(
    @Param("id") id: string
  ): Promise<{ message: string }> {
    // return {message: "hello"};
    return await this.projectService.deleteProject(id);
  }

  @Permissions("ProjectManagement")
  @Get("all-project")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async allProject(
    @Query() query: Partial<QueryOptions>
  ): Promise<{
    projects: adminProjectResponse[];
    currentPage?: number;
    totalPages?: number;
    totalCount?: number;
  }> {
    return await this.projectService.allProject(query);
  }
  

  @Permissions("ProjectManagement")
  @Delete("project-id/:id/users/:user-id")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async removeUserFromProject(
    @Param("id") projectId: string,
    @Param("user-id") userId: string
  ): Promise<{ success: boolean; message: string }> {
    
    return await this.projectService.deleteUserFromProject(projectId, userId);
  }

  @Permissions("ProjectManagement")
  @Post("project-id/:id/users/:user-id")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async addUserToProject(
    @Param("id") projectId: string,
    @Param("user-id") userId: string
  ): Promise<{ message: string }> {
    
    return await this.projectService.addUserToProject(projectId, userId);
  }

  @Permissions("ProjectManagement")
  @Post("project-id/:id/documents")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @UseInterceptors(FileInterceptor("file"))
  async addDocumentsToProject(
    @Param("id") projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() ProjectDTO: UploadDocumentDTO
  ): Promise<{ success: boolean; message: string }> {
    ProjectDTO.file = file
    return await this.projectService.uploadDocuments(projectId,ProjectDTO);
  }

  @Get(":id/documents")
  async getDocuments(@Param("id") projectId: string) {
    const documents = await this.projectService.getDocuments(projectId);
    return { success: true, documents };
  }

  @Permissions("ProjectManagement")
  @Post("project-stage-change/:id")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async projectStageChange(@Param("id") projectId: string) {
   const response = await this.projectService.projectStageChange(projectId)
   return { success: true, messgae: "Send To Client POC Succesfully" };
  }

  @Post("add-new-questionair/:projectId/:questionairId")
  @Permissions("ProjectManagement")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async addNewQuestionair(
    @Param("projectId") projectId: string,
    @Param("questionairId") questionairId: string)
  {
    return this.projectService.addNewQuestionnaire(
      projectId,
      questionairId
    );
  }

  @Permissions("MyProjects")
  @Get("my-projects/:id/:rolename")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async getQSAProjects(
    @Param("id") id: string,
    @Param("rolename") roleName: string,
    @Query() query: Partial<QueryOptions>
  ): Promise<{
    projects: ProjectDTO[];
    currentPage?: number;
    totalPages?: number;
    totalCount?: number;
  }> {
    return await this.projectService.getProjects(id, roleName, query);
  }

  @Permissions("MyProjects")
  @Get("projectQuestionaire/:projectId")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async getProjectQuestionaire(
    @Param("projectId") projectId: string,
  ) {
    return await this.projectService.getProjectQuestionaire(projectId);
  }

  @Permissions("MyProjects")
  @Get("project-leadership/:projectId")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async getProjectByAELeadership(
    @Param("projectId") projectId: string,
  ) {
    return await this.projectService.getProjectByAELeadership(projectId);
  }

  @Permissions("MyProjects")
  @Get("devices/:projectId")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async getProjectDevices(
    @Param("projectId") projectId: string,
    @Query() query: { page?: number; limit?: number; search?: string; deviceType?: string; department?: string }
  ) {
    return await this.projectService.getProjectDevices(projectId, query);
  }
  
  @Permissions("MyProjects")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Post("scoping-onboard-aepoc/:projectId")
  async scopingOnboardAE(
    @Param("projectId") projectId: string
  ) {
    return await this.projectService.scopingOnboardAEPOC(projectId)
  }

  @Permissions("S3-Upload")
  @Post("dce-docs/:projectId")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async updateDceDocs(@Param("projectId") projectId: string, @Body() dceData: cdeDocument) {
    console.log("projectId received:", typeof(projectId));
    return await this.projectService.updateDceDocx(projectId, dceData);
  }

@Permissions("S3-Upload")
@Get("dce-docs/:projectId")
@UseGuards(JwtAuthGuard, PermissionsGuard)
async getDceDocs(@Param("projectId") projectId: string) {
  return await this.projectService.getDceDocs(projectId);
}

  @Permissions("S3-Upload")
  @Post("gen-report")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
         async generateReport( 
          @Body() cdeDocument: cdeDocx)
          {
            console.log("cdeDocument-------------------------->>>",cdeDocument)
         return await this.projectService.generateReportx(cdeDocument);
         }

  @Permissions("ProjectManagement")
  @Patch("userresponse")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async updateChoiceSelection(
    @Body() updateDto: userResponseDto
  ): Promise<ProjectDTO> {
    return await this.projectService.userResponse(updateDto);
  }

  @Permissions("ProjectManagement")
  @Patch("gap-comment")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async updateGapComment(
    @Body() updateDto: gapCommentDto
  ): Promise<ProjectDTO> {
    return await this.projectService.updateGapComment(updateDto);
  }

  @Permissions("MyProjects")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Post("scoping-onboard-aestakeholder/:projectId")
  async scopingOnboardAEStake(
    @Param("projectId") projectId: string,
    @Body() aepocData: string[]
  ) {
    return await this.projectService.scopingOnboardAEStakeHolder(projectId, aepocData)
  }

  @Delete("dce-docs/:projectId")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async deleteDceDocs(
    @Param("projectId") projectId: string,
    @Body("s3Path") s3PathToRemove: string
  ) {
    return await this.projectService.deleteDceDocx(projectId, s3PathToRemove);
  }

  @Permissions("MyProjects")
  @Get("/:projectId/devices")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async getDeviceIdentification(
    @Param("projectId") projectId: string,
  ) {
    return await this.projectService.getDeviceProjects(projectId);
  }

  @Permissions("MyProjects")
  @Get("/:projectId/AE")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async getAEProjects(
    @Param("projectId") projectId: string,
  ) {
    return await this.projectService.getAEProjects(projectId);
  }

  @Permissions("ProjectManagement")
  @Delete(":projectId/device/:deviceRefName")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async deleteDeviceFromProject(
    @Param("projectId") projectId: string,
    @Param("deviceRefName") deviceRefName: string
  ): Promise<{ message: string }> {
    return await this.projectService.deleteDeviceFromProject(projectId, deviceRefName);
  }

}