import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
import { QuestionnaireService } from "../services/questionnaire.service";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { PermissionsGuard, Permissions } from "src/core/guards/permissions.guards";
import { QuestionnaireDto, QuestionDto, ScopingQstnrDTO } from "../dto/questionnaire.dto";
import { QstnrQueryOptions } from "../Query Interface/QstnrQuery.interface";
import { EvaluateDto } from "../dto/EvaluateDto.dto";
import { QuestionnaireResponseDto } from "../dto/questionnaireResponse.dto";
import { UpdateQuestionsDTO } from "../dto/updateQuestions.dto";

@Controller("questionnaires")
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) {}
  

  @Permissions("Questionnaire")
  @Post("createquestionnaire")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async createQuestionnaire(
    @Body() createQuestionnaireDto: QuestionnaireDto
  ): Promise<{id:string}> {
    return await this.questionnaireService.createQuestionnaire(createQuestionnaireDto);
  }

  @Permissions("Questionnaire")
  @Patch("updatequestionnaire/:id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async updateQuestionnaire(
    @Param("id") id: string, 
    @Body() updateData: Partial<QuestionnaireDto>
  ): Promise<QuestionnaireDto> {
    return await this.questionnaireService.updateQuestionnaire(id, updateData);
  }

  @Permissions("Questionnaire")
  @Delete("deletequestionnaire/:id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async deleteQuestionnaire(
    @Param("id") id: string
  ): Promise<{ success: boolean; message: string }> {
    return await this.questionnaireService.deleteQuestionnaire(id);
  }

  @Permissions("Questionnaire")
  @Get("all-questionnaire")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async allQuestionnaire(
    @Query() query: Partial<QstnrQueryOptions>
  ): Promise<{
    questionnaires: QuestionnaireResponseDto[];
    currentPage?: number;
    totalPages?: number;
    totalCount?: number;
  }> {
    return await this.questionnaireService.allQuestionnaires(query);
  }

  @Permissions("Questionnaire")
  @Get('phase/scoping')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
    async getScopingQuestionnaires(): Promise<ScopingQstnrDTO[]> {
      return this.questionnaireService.getScopingQuestionnaires();
    }

  @Permissions("Questionnaire")
  @Post("duplicate/:id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async duplicateQuestionnaire(
    @Param("id") id: string
  ): Promise<QuestionnaireDto> {
    return await this.questionnaireService.duplicateQuestionnaire(id);
  }

  @Permissions("Questionnaire")
  @Get(":id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async getQuestionnaireById(
    @Param("id") id: string
  ): Promise<QuestionnaireDto> {
    return await this.questionnaireService.getQuestionnaireById(id);
  }

  @Permissions("Questionnaire")
  @Post(":id/questions")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async upsertQuestions(
    @Param("id") id: string,
    @Body() questions: Partial<QuestionDto>[]
  ): Promise<UpdateQuestionsDTO> {
    return await this.questionnaireService.upsertQuestions(id, questions);
  }

  @Permissions("Questionnaire")
  @Post('evaluate')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
    async evaluate(@Body() evaluateDto: EvaluateDto) {
      const nextQuestion = await this.questionnaireService.evaluateLogicTree(evaluateDto);
      return { data: nextQuestion };
  }

  @Permissions("Questionnaire")
  @Delete(':questionnaireId/delete/:questionId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async deleteQuestionFromQuestionnaire(
  @Param('questionnaireId') questionnaireId: string,
  @Param('questionId') questionId: string,
  ):Promise<UpdateQuestionsDTO> {
  return this.questionnaireService.deleteQuestionFromQuestionnaire(questionnaireId, questionId);
  }

  @Permissions("Questionnaire")
  @Post(':questionnaireId/duplicate/:questionId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async duplicateQuestion(
  @Param('questionnaireId') questionnaireId: string,
  @Param('questionId') questionId: string,
  ): Promise<QuestionnaireDto["questions"]> {
  return await this.questionnaireService.duplicateQuestion(questionnaireId, questionId);
  }

  @Permissions("Questionnaire")
  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async publishQuestionnaire(
  @Param('id') id: string,
  @Body() questions: Partial<QuestionDto>[]
  ):Promise<UpdateQuestionsDTO> {
  return this.questionnaireService.publishQuestionnaire(id,{ questions });
}
}

