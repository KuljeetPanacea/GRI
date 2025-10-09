import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { TenantDAO } from "src/core/dao/base-tenant.dao";
import { Questionnaire, QuestionnaireDocument } from "../model/questionnaire.model";
import { QuestionType } from "../model/Question.type";
import { QuestionnaireDto, QuestionDto, ScopingQstnrDTO } from "../dto/questionnaire.dto";
import { BranchingLogic } from "../model/branching-logic.interface";


@Injectable()
export class QuestionnaireDao extends TenantDAO<Questionnaire, QuestionnaireDto> {
  
  constructor(
    @InjectModel(Questionnaire.name) protected readonly model: Model<QuestionnaireDocument>
  ) {
    super(model,QuestionnaireDto);
  }


  protected modelToDTO(model: Questionnaire | null): QuestionnaireDto | null {
    if (!model) return null;
  
    const dto = new QuestionnaireDto();
    dto.id = model._id.toString();
    dto.title = model.title;
    dto.description = model.description;
    dto.complianceType = model.complianceType;
    dto.industrySize = model.industrySize;
    dto.industryType = model.industryType;
    dto.phase = model.phase;
    dto.deviceType = model.deviceType;
    dto.isDeleted = model.isDeleted;
    dto.isPublished = model.isPublished;
    dto.status = model.status;
    dto.tenantId = model.tenantId || "";
    dto.createdBy = model.createdBy || "";
    dto.updatedBy = model.updatedBy || "";
    dto.createDtTime = model.createDtTime;
    dto.updateDtTime = model.updateDtTime;
    dto.currentQuestionTracker = model.currentQuestionTracker;
    dto.isCompletedAllQuestions = model.isCompletedAllQuestions
    dto.__v = model.__v;
  
    if (Array.isArray(model.questions)) {
      dto.questions = model.questions.map(q => ({
        _id: q?._id?.toString() || new Types.ObjectId().toString(),
        questionnaireId: model._id.toString(),
        type: (q?.type as QuestionType) || QuestionType.MULTIPLE_CHOICE,
        text: q?.text || "",
        choices: Array.isArray(q?.choices)
          ? q.choices.map(choice => ({ value: choice?.value || "" }))
          : [],
        isEditing: q?.isEditing ?? false,
        isDeleted: q?.isDeleted ?? false,
        requirements: q?.requirements || null,
        subRequirements: q?.subRequirements || null,
        subControl: q?.subControl || null,
        userResponse: q?.userResponse || "",
        alwaysGoTo: q?.alwaysGoTo?.toString() || "",
        setting: q?.setting || {},
        gaps: q?.gaps || undefined,
        branchingLogic: q?.branchingLogic || null,
        formBranchingLogic: q?.formBranchingLogic || null,
        evidenceReference: q?.evidenceReference || undefined,
        testingProcedure: q?.testingProcedure || undefined,
        // Unified table properties
        tableConfig: q?.tableConfig || undefined,
        tableData: q?.tableData || undefined,
      }));
    }
  
    return dto;
  }
  

  
  
  protected modelToDTOArray(models: Questionnaire[]): QuestionnaireDto[] {
    return models.map(model => this.modelToDTO(model)!);
  }
  
  protected dtoToModel(
    input: Partial<QuestionnaireDto>
  ): Partial<Questionnaire> {
    const dto: Partial<QuestionnaireDto> = Array.isArray(input)
      ? { questions: input as QuestionDto[] }
      : input;
  
    const modelObj: Partial<Questionnaire> = {};
  
    if (dto.title !== undefined) modelObj.title = dto.title;
    if (dto.description !== undefined) modelObj.description = dto.description;
    if (dto.complianceType !== undefined) modelObj.complianceType = dto.complianceType;
    if (dto.industrySize !== undefined) modelObj.industrySize = dto.industrySize;
    if (dto.industryType !== undefined) modelObj.industryType = dto.industryType;
    if (dto.phase !== undefined) modelObj.phase = dto.phase;
    if (dto.deviceType !== undefined) modelObj.deviceType = dto.deviceType;
    if (dto.appID !== undefined) modelObj.appID = dto.appID;
    if (dto.isDeleted !== undefined) modelObj.isDeleted = dto.isDeleted;
    if (dto.isPublished !== undefined) modelObj.isPublished = dto.isPublished;
    if (dto.status !== undefined) modelObj.status = dto.status;
    if(dto.currentQuestionTracker !== undefined) modelObj.currentQuestionTracker = dto.currentQuestionTracker
    if(dto.isCompletedAllQuestions !== undefined) modelObj.isCompletedAllQuestions = dto.isCompletedAllQuestions
    if (dto.questions && Array.isArray(dto.questions)) {
      modelObj.questions = dto.questions
        .filter(q => q !== null && q !== undefined)
        .map((q, index) => ({
          _id: q._id && Types.ObjectId.isValid(q._id)
            ? new Types.ObjectId(q._id.toString())
            : new Types.ObjectId(),
          questionnaireId: q.questionnaireId || "",
          type: q.type,
          text: q.text ?? "No text provided",
          choices: Array.isArray(q.choices)
            ? q.choices.map(choice => ({ value: choice.value }))
            : [],
          isEditing: q.isEditing ?? false,
          isDeleted: q.isDeleted ?? false,
          requirements: q.requirements ?? null,
          subRequirements: q.subRequirements ?? null,
          gaps: q.gaps ?? undefined,
          userResponse: q.userResponse ?? "",
          subControl: q.subControl ?? null,
          alwaysGoTo: q.alwaysGoTo && Types.ObjectId.isValid(q.alwaysGoTo)
            ? new Types.ObjectId(q.alwaysGoTo.toString())
            : undefined,
          setting: q.setting ?? {},
          branchingLogic: q.branchingLogic ?? null,
          formBranchingLogic: q.formBranchingLogic ?? null,
          evidenceReference: q.evidenceReference ?? undefined,
          testingProcedure: q.testingProcedure ?? undefined,
          // Unified table properties
          tableConfig: q.tableConfig ?? undefined,
          tableData: q.tableData ?? undefined,
        }));
    } else {
      modelObj.questions = [];
    }
  
    return modelObj;
  }
  
  protected isTenantEntity(): boolean {
    return true;
  }
  
  protected isSharedEntity(): boolean {
    return false;
  }
  
  protected isSystemEntity(): boolean {
    return false;
  }
}