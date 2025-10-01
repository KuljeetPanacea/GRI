import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { PermissionsGuard } from "src/core/guards/permissions.guards";
import { AssessmentTaskDTO, EvidenceDto } from "../dtos/assessmentTask.dto";
import { AssessmentTaskService } from "../service/assessmentTask.service";
import { userResponseDto } from "src/modules/project/dtos/updateProject.dto";
import { EvaluateDto } from "src/modules/questionaire/dto/EvaluateDto.dto";
import { console } from "inspector";

@Controller("assesment-task") // This sets the base route for the controller
export class AssessmentTaskController {
  constructor(private readonly assesmentService: AssessmentTaskService) {}

  @Post("create-assesment-task")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async createProject(@Body() assesmentDTO: AssessmentTaskDTO) {
    return await this.assesmentService.createAssesment(assesmentDTO);
  }

  @Patch("updateassesment/:id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async updateAssessmentEvidence(
    @Param("id") id: string,
    @Body() evidenceDTO: EvidenceDto // ensure this only contains the evidence
  ) {
    console.log(
      "Updating evidence for assessment task with ID:",
      id,
      "Evidence DTO:",
      evidenceDTO
    );
    return await this.assesmentService.uploadEvidence(id, evidenceDTO);
  }

  @Get("all-assesment-task/:projectid")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async assesmentById(@Param("projectid") projectid: string) {
    return await this.assesmentService.allAssesment(projectid);
  }

  @Get("assesment-task-AEStakeholder/:projectid/:primaryAEStakeholder")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async assesmentByAEStakeholderId(
    @Param("projectid") projectid: string,
    @Param("primaryAEStakeholder") AEStakeholder: string
  ) {
    return await this.assesmentService.allAssesmentbyAEStakeholder(
      projectid,
      AEStakeholder
    );
  }
  @Get("all-assesment-task-AEStakeholder/:projectid")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async allAssesmentStakeholders(@Param("projectid") projectid: string) {
    return await this.assesmentService.allAssesmentStakeholders(projectid);
  }

  @Patch("userresponse")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async updateChoiceSelection(
    @Body() updateDto: userResponseDto
  ): Promise<AssessmentTaskDTO> {
    return await this.assesmentService.userResponse(updateDto);
  }

  @Get("Gap-evidence/:assessmentId")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async getGapEvidence(@Param("assessmentId") assessmentId: string) {
    return await this.assesmentService.getGapEvidence(assessmentId);
  }

  @Post("Submit-response/:projectid/:assessmentid")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async update(
    @Param("projectid") projectId: string,
    @Param("assessmentid") assesmentId: string
  ): Promise<{ status: boolean; message: string }> {
    return await this.assesmentService.submitResponseRoc(
      projectId,
      assesmentId
    );
  }

  @Post("evaluate")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async evaluate(@Body() evaluateDto: EvaluateDto) {
    const nextQuestion =
      await this.assesmentService.evaluateLogicTree(evaluateDto);
    return { data: nextQuestion };
  }

  @Delete("delete-evidence/:assessmentId/:questionId")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async deleteEvidence(
    @Param("assessmentId") assessmentId: string,
    @Param("questionId") questionId: string
  ): Promise<{ success: boolean; message: string }> {
    return await this.assesmentService.deleteEvidence(assessmentId, questionId);
  }

  @Get("get-Uploaded-evidence/:assessmentId")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async getEvidence(@Param("assessmentId") assessmentId: string) {
    return await this.assesmentService.getEvidenceUploaded(assessmentId);
  }

  @Post("send-emails/:projectId")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async sendEmails(
    @Param("projectId") projectId: string,
    @Body() body: { sendType: "latest" | "all"; stakeholderEmails: string[] }
  ) {
    return await this.assesmentService.sendEmailsToStakeholders(
      projectId,
      body.sendType,
      body.stakeholderEmails
    );
  }

  @Get("evidenceTracker/:projectId")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async assessmentEvidenceTracker(@Param("projectId") projectId: string) {
    return await this.assesmentService.assessmentEvidenceTracker(projectId);
  }
}
