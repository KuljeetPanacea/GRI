import {
  Injectable,
  Inject,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { BaseService } from "src/core/service/base.service";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { Transactional } from "src/core/decorators/transaction-decorator";
import { ProjectDTO } from "../dtos/project.dto";
import { DATABASE_CONSTANTS } from "src/core/database/constant";
import { ProjectDAO } from "../dao/Project.dao";
import {
  ProjectAuditStage,
  ProjectStatus,
  UserRole,
  UserStatus,
} from "src/modules/authentication/Constant";
import { UpdateProjectDto, userResponseDto, gapCommentDto } from "../dtos/updateProject.dto";
import { UploadDocumentDTO } from "../dtos/uploadDocuments.dto";
import { ClientService } from "src/modules/client/services/client.service";
import { UserService } from "src/modules/user/services/user.service";
import { UserDTO } from "src/modules/user/dtos/User.dto";
import { PasswordHashingService } from "src/modules/authentication/services/password-hasing.service";
import {
  DEFAULT_QUERY_OPTIONS,
  FilterOptions,
  QueryOptions,
} from "src/core/database/query-options.interface";
import {
  ProjectResponseDTO,
  ProjectUpdateResponseDTO,
} from "../dtos/projectCreateResponse.dto";
import { ClientDTO } from "src/modules/client/dto/client.dto";
import { QuestionnaireService } from "src/modules/questionaire/services/questionnaire.service";
import { QuestionnaireDto } from "src/modules/questionaire/dto/questionnaire.dto";
import { UpdateClientDTO } from "src/modules/client/dto/updateClient.dto";
import { CreateProjectEvent } from "src/core/domain-events/createproject-events";
import { AuditEntity } from "../dtos/auditEntity.dto";
import { AssignTaskEvent } from "src/core/domain-events/assignTask-events";
import { AepocCreated } from "src/core/domain-events/aepocCreate-events";
import { OutboxService } from "src/core/outbox";
import { UserContext } from "src/core/contexts/user.context";
import { cdeDocument, cdeDocx } from "../dtos/cdeDocx";
import { S3Service } from "src/modules/s3/service/s3.service";
import { HttpService } from "@nestjs/axios";
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import FormData from "form-data";
import { adminProjectResponse } from "../dtos/adminProjectResponse.dto";

@Injectable()
export class ProjectService extends BaseService {
  constructor(
    @InjectConnection() connection: Connection,
    @Inject(DATABASE_CONSTANTS.PROJECT_DAO)
    private readonly projectDao: ProjectDAO,
    private readonly clientService: ClientService,
    private readonly userService: UserService,
    private readonly questionaireService: QuestionnaireService,
    private readonly outBoxService: OutboxService,
    private readonly s3Service: S3Service,
    private readonly httpService: HttpService
  ) {
    super(connection);
  }

  @Transactional()
  async createProject(projectData: ProjectDTO): Promise<ProjectResponseDTO> {
    projectData.status = ProjectStatus.DRAFT;
    projectData.currentAuditStage = ProjectAuditStage.PRE_SCOPING;
    const response = await this.projectDao.create(projectData);
    const userId = UserContext.getInstance().getUserId();
    console.log("userId checking bro", userId);
    const event = new CreateProjectEvent([userId]);
    await this.outBoxService.publishDomainEvent(event);
    if (response) {
      return {
        message: "Project onboarded successfully",
        projectId: response.id,
      };
    }
  }

  async updateProject(
    id: string,
    projectData: UpdateProjectDto | ProjectDTO
  ): Promise<ProjectUpdateResponseDTO> {
    console.log("projectData", projectData);
    const existingProject = (await this.projectDao.findById(id)) as ProjectDTO;
    if (projectData.client) {
      projectData.clientInfo = await this.getClientDetails(projectData.client);
    }

    if (projectData.scopingQSTRNR) {
      if (Array.isArray(projectData.scopingQSTRNR)) {
        projectData.scopingQSTRNRData = await Promise.all(
          projectData.scopingQSTRNR.map((id: string) =>
            this.getQuestionaireData(id)
          )
        );
        projectData.status = ProjectStatus.InProgress;
      }
    }

    if (!projectData?.scopingQSTRNR) {
      const sentEmails = new Set<string>();
      const qaUsers =
        projectData?.assignedTo?.filter(
          (a) => a.role === "QSA" || a.role === "QA"
        ) || [];

      for (const { id } of qaUsers) {
        const user = await this.userService.findUserById(id);
        if (user?.email && !sentEmails.has(user.email)) {
          await this.sendTaskEmailToAEPOC(id, user.email);
          sentEmails.add(user.email);
        }
      }
    }

    if (projectData.auditEntity) {
      const projectDataClient = await this.projectDao.findById(id);

      const data: UpdateClientDTO = {
        auditEntity: {
          pocEmail: projectData.auditEntity.pocEmail,
          pocName: projectData.auditEntity.pocName,
          pocPhoneNumber: projectData.auditEntity.pocPhoneNumber,
          assessedEntityname: projectData.auditEntity.assessedEntityname,
          assessedDba: projectData.auditEntity.assessedDba,
          assessedWebsiteLink: projectData.auditEntity.assessedWebsiteLink,
        },

        __v: 0,
      };

      await this.clientService.updateClient(
        (projectDataClient.clientInfo as any)?.clientId,
        data
      );

      console.log(
        "(projectDataClient.clientInfo as any)?.clientId",
        projectDataClient
      );
    }

    if (projectData.aeInternalAssessors) {
      const existingAssessors = existingProject.aeInternalAssessors || [];

      const assessorData = projectData.aeInternalAssessors[0];

      const isDuplicate = existingAssessors.some(
        (assessor) => assessor.email === assessorData.email
      );

      if (!isDuplicate) {
        let aeInternalAssessor = await this.userService.findUserByEmail(
          assessorData.email
        );

        if (!aeInternalAssessor) {
          const newUser: UserDTO = new UserDTO();

          newUser.username = assessorData.email;
          newUser.email = assessorData.email;
          newUser.password = "Test@123";
          newUser.name = assessorData.name;
          newUser.roles = [UserRole.AEStakeholder];
          newUser.countryCode = 91;
          newUser.mobileNumber = Number(assessorData.mobileNumber);
          newUser.status = UserStatus.Active;
          newUser.createdBy = "system";
          newUser.defaultPasswordchange = true;

          const result = await this.userService.createUser(newUser);
          aeInternalAssessor = result.data;
        }

        if (
          !existingAssessors.some(
            (assessor) => assessor.email === assessorData.email
          )
        ) {
          existingProject.aeInternalAssessors = [
            ...existingAssessors,
            assessorData,
          ];
        } else {
          existingProject.aeInternalAssessors = existingAssessors;
        }

        await this.projectDao.update(id, existingProject);

        return {
          message: "AE Internal Assessor added successfully",
        };
      } else {
        throw new Error(
          "Duplicate stakeholder entry found. This email already exists."
        );
      }
    }

    await this.projectDao.update(id, projectData);
    return { message: "Project details updated successfully" };
  }

  @Transactional()
  async deleteProject(id: string): Promise<{ message: string }> {
    // First, retrieve the project to check its current stage and status
    const project = await this.projectDao.findById(id);

    // Check if project exists
    if (!project) {
      throw new Error("Project not found");
    }

    // Check if project is in Pre-scoping stage and has Draft status
    if (project.currentAuditStage !== ProjectAuditStage.PRE_SCOPING) {
      throw new ForbiddenException(
        "Project cannot be deleted as it has moved to Scoping phase"
      );
    }

    if (project.status !== ProjectStatus.DRAFT) {
      throw new BadRequestException(
        "Only projects with Draft status can be deleted"
      );
    }

    const deleted: boolean = await this.projectDao.delete(id);

    if (deleted) {
      return {
        message: "Project deleted successfully.",
      };
    }

    throw new BadRequestException("Failed to delete project");
  }

  async allProject(options: FilterOptions): Promise<{
    projects: adminProjectResponse[];
    currentPage?: number;
    totalPages?: number;
    totalCount?: number;
    projectStatus?: string;
    projectStage?: string;
    ongoingProjects?: string;
    qsa?: string;
    projectName?: string;
  }> {
    console.log("options", options);
    const isPaginated =
      options.limit !== undefined || options.page !== undefined;

    const limit = options.limit ?? DEFAULT_QUERY_OPTIONS.limit!;
    const page = options.page ?? 1;
    const skip = options.skip ?? (page - 1) * limit;

    const filter: any = {};

    if (options.projectName && options.projectName.trim() !== "") {
      filter.projectName = {
        $regex: options.projectName.trim(),
        $options: "i",
      };
    }

    if (options.projectStatus) {
      filter.status = options.projectStatus;
    }

    // Only apply projectStage filter if it's not "All"
    if (options.projectStage && options.projectStage !== "All") {
      filter.currentAuditStage = options.projectStage;
    }

    // Fixed: Query for QSA by matching the ID in the assignedTo array, skip if "All"
    if (options.qsa && options.qsa !== "All") {
      filter["assignedTo.id"] = options.qsa;
    }

    // Fixed: Corrected the date range logic for ongoing projects
    if (options.ongoingProjects === "lastWeek") {
      const now = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(now.getDate() - 7);
      filter.createDtTime = { $gte: lastWeek, $lte: now };
    } else if (options.ongoingProjects === "lastMonth") {
      const now = new Date();
      const lastMonth = new Date();
      lastMonth.setMonth(now.getMonth() - 1);
      filter.createDtTime = { $gte: lastMonth, $lte: now };
    } else if (options.ongoingProjects === "last6Months") {
      const now = new Date();
      const last6Months = new Date();
      last6Months.setMonth(now.getMonth() - 6);
      filter.createDtTime = { $gte: last6Months, $lte: now };
    } else if (options.ongoingProjects) {
      // If a specific date is provided, filter for projects created from that date onwards
      const fromDate = new Date(options.ongoingProjects);
      const now = new Date();
      filter.createDtTime = { $gte: fromDate, $lte: now };
    }


    const mergedOptions: QueryOptions = {
      ...DEFAULT_QUERY_OPTIONS,
      ...options,
      limit: isPaginated ? limit : undefined,
      skip: isPaginated ? skip : undefined,
      sort: { createDtTime: -1, _id: -1 },
    };

    const [projects, totalCount] = await Promise.all([
      this.projectDao.findAllForAdmin(filter, mergedOptions),
      this.projectDao.count(filter),
    ]);

    if (!isPaginated) {
      return { projects };
    }

    const totalPages = Math.ceil(totalCount / limit);

    return {
      projects,
      currentPage: page,
      totalPages,
      totalCount,
    };
  }

  async deleteUserFromProject(
    projectId: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    const deleted: ProjectDTO = await this.projectDao.update(projectId, {
      client: userId,
    });

    if (deleted) {
      return {
        success: true,
        message: "User removed from the project successfully.",
      };
    }
  }

  async addUserToProject(
    projectId: string,
    userId: string
  ): Promise<{ message: string }> {
    const added: ProjectDTO = await this.projectDao.update(projectId, {
      client: userId,
    });

    if (added) {
      return {
        message: "User assigned to the project successfully.",
      };
    }
  }

  async uploadDocuments(projectId: string, ProjectDTO: UploadDocumentDTO) {
    const response = await this.projectDao.update(projectId, ProjectDTO);
    if (response) {
      return {
        success: true,
        message: "Document Uploaded successfully.",
      };
    }
  }

  async getDocuments(projectId: string) {
    return this.projectDao.findById(projectId);
  }

  async getUserDetails(qsaId: string): Promise<UserDTO> {
    const userDetails = await this.userService.findUserById(qsaId);
    if (!userDetails) {
      throw new Error(`Client with ID ${qsaId} not found`);
    }
    return userDetails;
  }

  async getQuestionaireData(questionaireId: string): Promise<QuestionnaireDto> {
    const questionaireData =
      await this.questionaireService.getQuestionnaireById(questionaireId);
    if (!questionaireData) {
      throw new Error(`Questionaire with ID ${questionaireId} not found`);
    }
    return questionaireData;
  }

  async getClientDetails(userId: string): Promise<ClientDTO> {
    const userDetails = await this.clientService.getClientById(userId);
    if (!userDetails) {
      throw new Error(`Client with ID ${userId} not found`);
    }
    return userDetails;
  }
  @Transactional()
  async projectStageChange(projectId: string) {
    const projectDetails = await this.projectDao.findById(projectId);
    if (!projectDetails) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    // const userCreate: UserDTO = {
    //   username: projectDetails.auditEntity.pocEmail,
    //   email: projectDetails.auditEntity.pocEmail,
    //   password: await this.passwordHashingService.hashPassword("Test@1234"),
    //   name: projectDetails.auditEntity.pocName,
    //   roles: [UserRole.AEPOC],
    //   countryCode: projectDetails.auditEntity.pocCountryCode,
    //   mobileNumber: projectDetails.auditEntity.pocPhoneNumber,
    //   status: UserStatus.Active,
    //   createdBy: "system",
    //   defaultPasswordchange: true
    // };
    //  const response = await this.userService.createUser(userCreate);

    let projectUpdateDetails: UpdateProjectDto = { __v: projectDetails.__v };
    projectUpdateDetails.currentAuditStage = ProjectAuditStage.ASSESSMENT;
    await this.updateProject(projectId, projectUpdateDetails);
  }
  @Transactional()
  async addNewQuestionnaire(projectId: string, questionairId: string) {
    const projectDetails = await this.projectDao.findById(projectId);
    if (!projectDetails) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    // Need to check questionairId is valid or not once questionair module is made using dummy data right now
    let projectUpdateDetails: UpdateProjectDto = { __v: projectDetails.__v };

    // projectUpdateDetails.scopingQSTRNRData = {
    //   title: "Dummy Questionnaire",
    //   questions: [
    //     {
    //       id: "1",
    //       question: "What is your favorite color?",
    //       options: ["Red", "Blue", "Green", "Yellow"],
    //       answer: null,
    //     },
    //     {
    //       id: "2",
    //       question: "Do you like programming?",
    //       options: ["Yes", "No"],
    //       answer: null,
    //     },
    //   ],
    // };

    // Update the project with new data
    await this.updateProject(projectId, projectUpdateDetails);
    return { success: true, message: "Successfully Questionair Added." };
  }
  async userResponse(updateDto: userResponseDto): Promise<ProjectDTO> {
    const { questionId, choiceValue } = updateDto;

    const project = await this.projectDao.findOne({
      "scopingQSTRNR.questions._id": questionId,
    });

    if (!project) {
      throw new Error("Project not found");
    }

    const updatedScopingQSTRNRData = (project.scopingQSTRNRData || []).map((questionnaire: QuestionnaireDto) => {
      const questions = questionnaire.questions || [];

      // Check if this questionnaire contains the questionId
      const containsQuestion = questions.some(q => q._id === questionId);

      if (!containsQuestion) return questionnaire;

      const updatedQuestions = questions.map((question) => {
        if (question._id === questionId) {
          const isArray = Array.isArray(choiceValue);
          let userResponse;

          switch (question.type) {
            case "short_text":
            case "long_text":
            case "single_choice":
              userResponse = isArray ? choiceValue[0] : choiceValue;
              break;
            case "multiple_choice":
              userResponse = isArray ? choiceValue : [choiceValue];
              break;
            default:
              userResponse = question.userResponse;
          }

          return { ...question, userResponse };
        }

        return question;
      });

      return {
        ...questionnaire,
        questions: updatedQuestions,
      };
    });

    return await this.projectDao.update(project.id, {
      scopingQSTRNRData: updatedScopingQSTRNRData,
    });
  }

  async updateGapComment(updateDto: gapCommentDto): Promise<ProjectDTO> {
    const { questionId, gapComment, clientComment, status } = updateDto;

    const project = await this.projectDao.findOne({
      "scopingQSTRNR.questions._id": questionId,
    });

    if (!project) {
      throw new Error("Project not found");
    }

    // Create the gaps object
    const gapsObject = {
      gaps: gapComment,
      clientComment: clientComment || "",
      status: status || "Finding Open"
    };

    const updatedScopingQSTRNRData = (project.scopingQSTRNRData || []).map((questionnaire: QuestionnaireDto) => {
      const questions = questionnaire.questions || [];

      // Check if this questionnaire contains the questionId
      const containsQuestion = questions.some(q => q._id === questionId);

      if (!containsQuestion) return questionnaire;

      const updatedQuestions = questions.map((question) => {
        if (question._id === questionId) {
          return { ...question, gaps: gapsObject };
        }

        return question;
      });

      return {
        ...questionnaire,
        questions: updatedQuestions,
      };
    });

    return await this.projectDao.update(project.id, {
      scopingQSTRNRData: updatedScopingQSTRNRData,
    });
  }

  async getProjects(
    id: string,
    roleName: string,
    options?: QueryOptions & {
      projectStatus?: string;
      ongoingProjects?: string;
      projectName?: string;
    }
  ): Promise<{
    projects: ProjectDTO[];
    currentPage?: number;
    totalPages?: number;
    totalCount?: number;
  }> {
    const isPaginated =
      options?.limit !== undefined || options?.page !== undefined;

    const limit = options?.limit ?? DEFAULT_QUERY_OPTIONS.limit!;
    const page = options?.page ?? 1;
    const skip = options?.skip ?? (page - 1) * limit;

    const filter: any = {
      assignedTo: {
        $elemMatch: {
          id: id,
          role: roleName,
        },
      },
      status: { $in: [ProjectStatus.COMPLETED, ProjectStatus.InProgress] },
    };

    // Add projectStatus filter if provided and not "All"
    if (options?.projectStatus && options.projectStatus !== "All") {
      filter.status = options.projectStatus;
    }

    // Add ongoingProjects filter if provided
    if (options?.ongoingProjects) {
      if (options.ongoingProjects === "lastWeek") {
        const now = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(now.getDate() - 7);
        filter.createDtTime = { $gte: lastWeek, $lte: now };
      } else if (options.ongoingProjects === "lastMonth") {
        const now = new Date();
        const lastMonth = new Date();
        lastMonth.setMonth(now.getMonth() - 1);
        filter.createDtTime = { $gte: lastMonth, $lte: now };
      } else if (options.ongoingProjects === "last6Months") {
        const now = new Date();
        const last6Months = new Date();
        last6Months.setMonth(now.getMonth() - 6);
        filter.createDtTime = { $gte: last6Months, $lte: now };
      } else {
        const fromDate = new Date(options.ongoingProjects);
        const now = new Date();
        filter.createDtTime = { $gte: fromDate, $lte: now };
      }
    }

    if (options.projectName && options.projectName.trim() !== "") {
      filter.projectName = {
        $regex: options.projectName.trim(),
        $options: "i",
      };
    }


    const [projects, totalCount] = await Promise.all([
      this.projectDao.find(
        {
          ...filter,
        },
        {
          ...(isPaginated ? { limit, skip } : {}),
          select: [
            "projectName",
            "description",
            "status",
            "client",
            "assignedTo",
            "createdByName",
            "createDtTime",
            "currentAuditStage",
            "updateDtTime",
            "aeInternalAssessors",
          ],
        }
      ),
      this.projectDao.count(filter),
    ]);
    const sorted = projects.sort((a, b) => {
      if (a.status === b.status) {
        return (
          new Date(b.updateDtTime!).getTime() -
          new Date(a.updateDtTime!).getTime()
        );
      }
      return a.status === UserStatus.InProgress ? -1 : 1;
    });

    if (!isPaginated) {
      return { projects: sorted };
    }

    const totalPages = Math.ceil(totalCount / limit);

    return {
      projects: sorted,
      currentPage: page,
      totalPages,
      totalCount,
    };
  }

  async sendTaskEmailToAEPOC(userId: string, recipientEmailId: string) {
    console.log("userId checking bro", userId);
    const event = new AssignTaskEvent([userId]);

    await this.outBoxService.publishDomainEvent(event);
  }
  async sendAepocCreatedEmail(qsaId: string, aepocId: string) {
    const recipientEmailId = aepocId;
    const userId = qsaId;

    // Create the AssignTaskEvent
    const event = new AepocCreated([userId]);

    await this.outBoxService.publishDomainEvent(event);
  }
  async scopingOnboardAEPOC(projectId: string) {
    const projectDetails = await this.projectDao.findById(projectId);
    if (!projectDetails) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    const aepocData = projectDetails.auditEntity;
    let aepocUser = await this.userService.findUserByEmail(aepocData.pocEmail);
    let isNewUser = false;

    if (!aepocUser) {
      isNewUser = true;
      const newUser: UserDTO = new UserDTO();
      newUser.username = aepocData.pocEmail;
      newUser.email = aepocData.pocEmail;
      newUser.password = "Test@123";
      newUser.name = aepocData.pocName;
      newUser.roles = [UserRole.AEPOC];
      newUser.countryCode = 91;
      newUser.mobileNumber = Number(aepocData.pocPhoneNumber);
      newUser.status = UserStatus.Active;
      newUser.createdBy = "system";
      newUser.defaultPasswordchange = true;
      const result = await this.userService.createUser(newUser);
      aepocUser = result.data;
    }

    const aepocAssignment = {
      id: aepocUser.id,
      name: aepocUser.name,
      role: UserRole.AEPOC,
    };

    // Ensure the AEPOC user is not already assigned to the project
    if (
      !projectDetails.assignedTo.some(
        (entity) => entity.id === aepocUser.id && entity.role === UserRole.AEPOC
      )
    ) {
      projectDetails.assignedTo.push(aepocAssignment);
      await this.projectDao.update(projectId, projectDetails);
    }

    if (isNewUser) {
      await this.sendAepocCreatedEmail(aepocUser.id, aepocData.pocEmail);
    }
    await this.sendTaskEmailToAEPOC(aepocUser.id, aepocData.pocEmail);
    await this.projectStageChange(projectId);
    return `Email will be sent to AE POC regarding scoping tasks.`;
  }
  async getProjectById(projectId: string) {
    return await this.projectDao.findById(projectId);
  }

async getProjectByAELeadership(projectId: string) {
  const project = await this.projectDao.findById(projectId);
  return {
    project,
  };
}



  async updateProjectDevice(
    id: string,
    projectData: UpdateProjectDto | ProjectDTO
  ): Promise<ProjectUpdateResponseDTO> {
    try {
      await this.projectDao.update(id, projectData);
      return { message: "Project details updated successfully" };
    } catch (error) {
      throw new Error("Error updating project device");
    }
  }

  /**
   * Delete a device from a project by projectId and deviceRefName
   */
  async deleteDeviceFromProject(projectId: string, deviceRefName: string): Promise<{ message: string }> {
    const deleted = await this.projectDao.deleteDeviceFromProject(projectId, deviceRefName);
    if (deleted) {
      return { message: "Device deleted successfully." };
    } else {
      throw new BadRequestException("Device not found or could not be deleted.");
    }
  }
  async updateDceDocx(
    id: string,
    newDoc: cdeDocument
  ): Promise<ProjectUpdateResponseDTO> {
    const existingProject = (await this.projectDao.findById(id)) as ProjectDTO;

    const existingDocs = existingProject.cdeDocs || [];

    // Check if a document with the same cdeType already exists
    const existingDocIndex = existingDocs.findIndex(
      (doc: any) => doc.cdeType === newDoc.cdeType
    );

    let updatedCdeDocs;
    if (existingDocIndex !== -1) {
      // Replace the existing document with the same cdeType
      updatedCdeDocs = [...existingDocs];
      updatedCdeDocs[existingDocIndex] = newDoc;
    } else {
      // Add new document if no document with this cdeType exists
      updatedCdeDocs = [...existingDocs, newDoc];
    }

    // Prepare the final update payload
    const updatePayload = {
      cdeDocs: updatedCdeDocs,
    };

    // Perform the update
    await this.projectDao.update(id, updatePayload);

    return { message: "Project details updated successfully" };
  }

  async getDceDocs(projectId: string) {
    // Fetch the project by ID
    const project = await this.projectDao.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    // Return only the cdeDocs array (or an empty array if not present)
    return {
      success: true,
      data: project.cdeDocs ?? []
    };
  }
  async generateReportx(
    cdeDocument: cdeDocx
  ): Promise<ProjectUpdateResponseDTO> {
    const { projectId, fileNames } = cdeDocument;
    const existingProject = (await this.projectDao.findById(
      projectId
    )) as ProjectDTO;

    try {
      // Create FormData to send files to Python service
      const form = new FormData();
      let array = []
      // Fetch each file from S3 and add to FormData
      for (const fileName of fileNames) {
        try {
          // Get signed URL for download
          const signedUrl = await this.s3Service.getSignedDownloadUrl(
            fileName,
            projectId
          );

          const fileResponse = await fetch(signedUrl);
          if (!fileResponse.ok) {
            throw new Error(
              `Failed to fetch file ${fileName}: ${fileResponse.statusText}`
            );
          }
          array.push(fileResponse.url)
          // Get file buffer
          const fileBuffer = await fileResponse.arrayBuffer();
          const buffer = Buffer.from(fileBuffer);

          // Add file to FormData
          form.append("files", buffer, fileName);
          console.log(`Added file to form: ${fileName}`);
        } catch (error) {
          console.error(`Error processing file ${fileName}:`, error);
          // Continue with other files
        }
      }
      console.log("Array of files:", { "s3_urls": array });
      const response = await this.httpService.axiosRef.post(
        "https://pi-audit-app.radpretation.ai/python-model/upload_files", { "s3_urls": array }
      );

      console.log("File upload response:", response.data);

      if (!response.data || !response.data.content_hash) {
        throw new Error("File upload failed - no content hash received");
      }

      const finalReport = await this.httpService.axiosRef.post(
        "https://pi-audit-app.radpretation.ai/python-model/generate_full_report",
        {
          content_hash: response.data.content_hash,
          project_name: existingProject.projectName || "",
          qsa_name: "", // You might want to get this from somewhere
          date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
        },
        {
          timeout: 600000, // 10 minutes for report generation
          headers: {
            "Content-Type": "application/json",
            Connection: "keep-alive",
          },
          validateStatus: (status) => status < 500,
        }
      );
      const report = finalReport.data;

      if (!existingProject.ScopeDocument) {
        existingProject.ScopeDocument = {};
      }
      existingProject.ScopeDocument = report;
      await this.projectDao.update(existingProject.id, existingProject);

      return {
        ...finalReport.data,
      } as ProjectUpdateResponseDTO;
    } catch (error) {
      console.error("Error in generateReportx:", error);
    }
  }

  async scopingOnboardAEStakeHolder(
    projectId: string,
    aeStakeHolderData: string[]
  ) {
    const projectDetails = await this.projectDao.findById(projectId);
    if (!projectDetails) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    for (const email of aeStakeHolderData) {
      const assessorDetails = projectDetails.aeInternalAssessors.find(
        (assessor: any) => assessor.email === email
      );
      let aeStakeHolder = await this.userService.findUserByEmail(email);
      let isNewUser = false;

      if (!aeStakeHolder) {
        isNewUser = true;

        const newUser: UserDTO = new UserDTO();
        newUser.username = assessorDetails.email;
        newUser.email = assessorDetails.email;
        newUser.password = "Test@123";
        newUser.name = assessorDetails.name;
        newUser.roles = [UserRole.AEStakeholder];
        newUser.countryCode = 91;
        newUser.mobileNumber = Number(assessorDetails.mobileNumber);
        newUser.status = UserStatus.Active;
        newUser.createdBy = "system";
        newUser.defaultPasswordchange = true;

        const result = await this.userService.createUser(newUser);
        aeStakeHolder = result.data;
      }

      const aeStakeHolderAssignment = {
        id: aeStakeHolder.id,
        name: aeStakeHolder.name,
        role: UserRole.AEStakeholder,
      };

      const alreadyAssigned = projectDetails.assignedTo.some(
        (entity) =>
          entity.id === aeStakeHolder.id &&
          entity.role === UserRole.AEStakeholder
      );

      if (!alreadyAssigned) {
        projectDetails.assignedTo.push(aeStakeHolderAssignment);
      }

      if (isNewUser) {
        await this.sendAepocCreatedEmail(
          aeStakeHolder.id,
          assessorDetails.email
        );
      }

      await this.sendTaskEmailToAEPOC(aeStakeHolder.id, assessorDetails.email);
    }

    await this.projectDao.update(projectId, projectDetails);
    await this.projectStageChange(projectId);

    return `Emails have been sent to AE Stakeholders regarding scoping tasks.`;
  }

  async deleteDceDocx(
    projectId: string,
    s3PathToRemove: string
  ): Promise<ProjectUpdateResponseDTO> {
    const existingProject = (await this.projectDao.findById(
      projectId
    )) as ProjectDTO;
    if (!existingProject) {
      throw new Error("Project not found");
    }
    const existingDocs = existingProject.cdeDocs || [];

    const docToRemove = existingDocs.find(
      (doc) => doc.s3Path === s3PathToRemove
    );

    if (!docToRemove) {
      throw new Error(
        "Document with the specified s3Path not found in the project"
      );
    }

    const updatedCdeDocs = existingDocs.filter(
      (doc) => doc.s3Path !== s3PathToRemove
    );
    const updatePayload = {
      cdeDocs: updatedCdeDocs,
    };

    await this.projectDao.update(projectId, updatePayload);
    await this.s3Service.deleteFile(docToRemove.fileName, projectId);

    return {
      message: `Document '${docToRemove.fileName}' deleted from project successfully`,
    };
  }

  async getProjectQuestionaire(projectId: string) {
    const projects = await this.projectDao.findById(projectId);
    return projects.scopingQSTRNRData ?? [];
  }

  async getProjectDevices(
    projectId: string,
    options?: { page?: number; limit?: number; search?: string; deviceType?: string; department?: string }
  ) {
    // Use the new DAO method for paginated, filtered, searched devices
    return await this.projectDao.getPaginatedDevices(projectId, options || {});
  }

  async getDeviceProjects(projectId: string) {
    const projects = await this.projectDao.findById(projectId);
    return projects.device ?? [];
  }

  async getAEProjects(projectId: string) {
    const projects = await this.projectDao.findById(projectId);
    return projects.aeInternalAssessors ?? [];
  }
}
