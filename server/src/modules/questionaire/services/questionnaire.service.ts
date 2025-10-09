import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { QuestionnaireDao } from '../Dao/questionnaire.dao';
import { BaseService } from 'src/core/service/base.service';
import { QuestionnaireDto, AddQuestionsDto, QuestionDto, ScopingQstnrDTO } from '../dto/questionnaire.dto';
import { Connection, Types } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { DEFAULT_QUERY_OPTIONS, QueryOptions } from 'src/core/database/query-options.interface';
import { buildQuestionnaireFilters } from '../Query Interface/QstnrQuery.interface';
import { BranchingLogic } from '../model/branching-logic.interface';
import { LogicBuilder } from '../classes/logic-builder';
import { AssessmentTaskService } from 'src/modules/assessmentTask/service/assessmentTask.service';
import { QuestionnaireResponseDto } from '../dto/questionnaireResponse.dto';
import { UpdateQuestionsDTO } from '../dto/updateQuestions.dto';
import { plainToInstance } from 'class-transformer';
import { EvaluateDto } from '../dto/EvaluateDto.dto';
import { BranchEvaluator } from '../classes/branch-evaluator';

@Injectable()
export class QuestionnaireService extends BaseService {
  constructor(
    @InjectConnection() connection: Connection,
    private readonly questionnaireDao: QuestionnaireDao
  ) {
    super(connection);
  }
  async createQuestionnaire(createQuestionnaireDto: QuestionnaireDto): Promise<{id:string}> {
    const questionaire =  await this.questionnaireDao.create(createQuestionnaireDto);
    return {id: questionaire.id}
  }

  async updateQuestionnaire(id: string, updateData: Partial<QuestionnaireDto>): Promise<QuestionnaireDto> {
    return await this.questionnaireDao.update(id, updateData);
  }

  async deleteQuestionnaire(id: string): Promise<{ success: boolean; message: string }> {
    const deleted: QuestionnaireDto = await this.questionnaireDao.update(id, { isDeleted: true });
    if (deleted) {
      return {
        success: true,
        message: "Questionnaire deleted successfully.",
      };
    }
    throw new NotFoundException(`Questionnaire with ID "${id}" not found`);
  }

  async allQuestionnaires(options: QueryOptions): Promise<{
    questionnaires: QuestionnaireResponseDto[];
    currentPage?: number;
    totalPages?: number;
    totalCount?: number;
  }> {
    const getSelect = ['id', 'complianceType', 'title','status','phase','createDtTime','createdAt','updatedAt','updateDtTime',"__v","tenantId","createdBy","updatedBy","_id"];
    const isPaginated = options.limit !== undefined || options.page !== undefined;

    const limit = options.limit ?? DEFAULT_QUERY_OPTIONS.limit!;
    const page = options.page ?? 1;
    const skip = options.skip ?? ((page - 1) * limit);

    const mergedOptions: QueryOptions = {
      ...DEFAULT_QUERY_OPTIONS,
      ...options,
      limit: isPaginated ? limit : undefined,
      skip: isPaginated ? skip : undefined,
      select: getSelect,
    };

    const filter = buildQuestionnaireFilters(options);

    const [questionnaires, totalCount] = await Promise.all([
      this.questionnaireDao.find(filter, mergedOptions),
      this.questionnaireDao.count(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    return {
      questionnaires,
      currentPage: page,
      totalPages,
      totalCount,
    };
  }

  async getScopingQuestionnaires(): Promise<ScopingQstnrDTO[]> {
       const filter: any = { 
      phase: 'Scoping', 
      isDeleted: false 
    };
  return this.questionnaireDao.find(filter);
}

  async  getQuestionnaireById(id: string): Promise<QuestionnaireDto> {
    const getSelect= [
      '_id',
      'id',
      'title',
      'description',
      'complianceType',
      'industrySize',
      'industryType',
      'deviceType',
      'status',
      'isDeleted',
      'isPublished',
      'tenantId',
      "phase",
      'createdBy',
      'updatedBy',
      'createDtTime',
      'updateDtTime',
      'currentQuestionTracker',
      'questions',
      '__v'
    ]
    const dto = await this.questionnaireDao.findById(id,{
      select: getSelect,
    });
    if (!dto) {
      throw new NotFoundException(`Questionnaire with ID "${id}" not found`);
    }
    return dto;
  }

  async duplicateQuestionnaire(id: string): Promise<QuestionnaireDto> {
    const doc = await this.questionnaireDao.findById(id);
    if (!doc) {
      throw new NotFoundException(`Questionnaire with ID "${id}" not found`);
    }
    const duplicateDto: QuestionnaireDto = { ...doc, title: doc.title + '-copy' };
    return await this.questionnaireDao.create(duplicateDto);
  }

  async upsertQuestions(
    id: string,
    questions: Partial<QuestionDto>[]
  ): Promise<UpdateQuestionsDTO> {
    const existingDto = await this.questionnaireDao.findById(id);
    if (!existingDto) {
      throw new NotFoundException(`Questionnaire with ID "${id}" not found`);
    }
  
    const updatedQuestions = [...existingDto.questions];
  
    for (const incoming of questions) {
      const index = updatedQuestions.findIndex(q => q._id === incoming._id);
      let formBranchingLogic: BranchingLogic[] = [];

      // Validate table configuration for table_type questions
      if (incoming.type === 'table_type') {
        this.validateTableConfiguration(incoming);
      }

if (Array.isArray(incoming.branchingLogic)) {
  for (const group of incoming.branchingLogic) {
    const builder = new LogicBuilder(group.next ?? null);

    if (Array.isArray(group.conditions)) {
      for (const cond of group.conditions) {
        let normalizedValue = cond.value;

        if (Array.isArray(cond.value) && cond.value.length === 1) {
          normalizedValue = cond.value[0];
        }

        builder.addCondition(
          cond.questionId,
          cond.operator,
          normalizedValue,
          'AND'
        );
      }

      const logic = builder.getLogic();
      formBranchingLogic.push(logic);
    }
  }
}

      if (index >= 0) {
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          ...incoming,
          _id: updatedQuestions[index]._id,
          formBranchingLogic,
          evidenceReference: incoming.evidenceReference ?? updatedQuestions[index].evidenceReference,
          testingProcedure: incoming.testingProcedure ?? updatedQuestions[index].testingProcedure,
          // Preserve table properties for table_type questions
          ...(incoming.type === 'table_type' && {
            tableConfig: incoming.tableConfig || updatedQuestions[index].tableConfig || {
              mode: 'dynamic',
              columns: []
            },
            tableData: incoming.tableData || updatedQuestions[index].tableData || []
          }),
        };
      } else {
        updatedQuestions.push({
          _id: incoming._id && Types.ObjectId.isValid(incoming._id)
            ? incoming._id.toString()
            : new Types.ObjectId().toString(),
          questionnaireId: incoming.questionnaireId ?? id,
          type: incoming.type,
          text: incoming.text ?? "No text provided",
          choices: Array.isArray(incoming.choices)
            ? incoming.choices.map(choice => ({ value: choice.value }))
            : [],
          isEditing: incoming.isEditing ?? false,
          isDeleted: incoming.isDeleted ?? false,
          requirements: incoming.requirements ?? null,
          subRequirements: incoming.subRequirements ?? null,
          subControl: incoming.subControl ?? null,
          userResponse: incoming.userResponse ?? "",
          alwaysGoTo: incoming.alwaysGoTo && Types.ObjectId.isValid(incoming.alwaysGoTo)
            ? incoming.alwaysGoTo.toString()
            : undefined,
          setting: incoming.setting ?? "",
          branchingLogic: incoming.branchingLogic ?? null,
          formBranchingLogic,
          evidenceReference: incoming.evidenceReference ?? undefined,
          testingProcedure: incoming.testingProcedure ?? undefined,
          // Include table properties for table_type questions
          ...(incoming.type === 'table_type' && {
            tableConfig: incoming.tableConfig || {
              mode: 'dynamic',
              columns: []
            },
            tableData: incoming.tableData || []
          }),
        });
      }
    }
  
    const updated = await this.questionnaireDao.update(id, { questions: updatedQuestions, isPublished: false,status:"Draft" });
    return plainToInstance(UpdateQuestionsDTO, updated, {
      excludeExtraneousValues: true,
    });
  }

  async evaluateLogicTree({ questionnaireId, responses, currentQuestionId }: EvaluateDto) {
    const questionnaire = await this.questionnaireDao.findById(questionnaireId);
    if (!questionnaire) {
      throw new NotFoundException(`Questionnaire with ID "${questionnaireId}" not found`);
    }

      const question = questionnaire.questions.find(q => q._id.toString() === currentQuestionId);
      if (!question?.formBranchingLogic) {
        return false;
      }
    
      const fixMissingOperations = (logic: BranchingLogic): BranchingLogic => {
        if ('conditions' in logic && Array.isArray(logic.conditions)) {
          return {
            ...logic,
            operation: logic.operation || 'AND', // default to AND
            conditions: logic.conditions.map(fixMissingOperations),
          };
        }
        return logic;
      };
    
      const evaluator = new BranchEvaluator(responses);
      const nextQuestionId = evaluator.evaluate({
        operation: 'OR',
        conditions: question.formBranchingLogic as BranchingLogic[],
        next: null,
      });
    
      if (!nextQuestionId) {
        if (question.alwaysGoTo) {
          const fallbackQuestion = questionnaire.questions.find(q => q._id.toString() === question.alwaysGoTo);
          if (!fallbackQuestion) {
            throw new NotFoundException(`AlwaysGoTo question with ID "${question.alwaysGoTo}" not found`);
          }
          return fallbackQuestion;
        }
        return null;
      }
    
      const nextQuestion = questionnaire.questions.find(q => q._id.toString() === nextQuestionId);
      if (!nextQuestion) {
        throw new NotFoundException(`Next question with ID "${nextQuestionId}" not found`);
      }
    
      return nextQuestion;
    }

  async deleteQuestionFromQuestionnaire(questionnaireId: string, questionId: string): Promise<UpdateQuestionsDTO> {
    const existingDto = await this.questionnaireDao.findById(questionnaireId);
    
    if (!existingDto) {
        throw new NotFoundException(`Questionnaire with ID "${questionnaireId}" not found`);
    }
    existingDto.questions = existingDto.questions.filter(q => q._id.toString() !== questionId);
    const updatedDto = await this.questionnaireDao.update(questionnaireId, { questions: existingDto.questions });

    return plainToInstance(UpdateQuestionsDTO, updatedDto, {
      excludeExtraneousValues: true,
    });
}

  async duplicateQuestion(questionnaireId: string, questionId: string): Promise<QuestionnaireDto["questions"]> {
    const questionnaire = await this.questionnaireDao.findById(questionnaireId);
    if (!questionnaire) throw new NotFoundException('Questionnaire not found');
  
    const questionToDuplicate = questionnaire.questions.find(q => q._id.toString() === questionId);
    if (!questionToDuplicate) throw new NotFoundException('Question not found');
  
    const duplicatedQuestion = {
      ...questionToDuplicate,
      _id: new Types.ObjectId().toString(),
      text: `${questionToDuplicate.text}-copy`,
      isDeleted: false,
    };
    questionnaire.questions.push(duplicatedQuestion);
    const updated = await this.questionnaireDao.update(questionnaireId, {
      questions: questionnaire.questions,
      // updateDtTime: new Date().toISOString(),
    });
  
    return updated.questions;
  }

  async publishQuestionnaire(
    id: string,
    body: { questions: Partial<QuestionDto>[] }
  ): Promise<UpdateQuestionsDTO> {
    const { questions } = body;
    await this.upsertQuestions(id, questions);
    const existingQstnr = await this.questionnaireDao.findById(id);
    if (!existingQstnr) {
      throw new NotFoundException(`Questionnaire with ID "${id}" not found`);
    }
  
    const updated = this.questionnaireDao.update(id, {
      ...existingQstnr,
      isPublished: true,
      status: "Published",
    });

    return plainToInstance(UpdateQuestionsDTO, updated, {
      excludeExtraneousValues: true,
    });
  }

  private validateTableConfiguration(question: Partial<QuestionDto>): void {
    if (question.type !== 'table_type') return;

    // Validate table configuration
    if (!question.tableConfig) {
      throw new BadRequestException('Table type questions must have table configuration');
    }

    // Validate table columns
    if (!question.tableConfig.columns || question.tableConfig.columns.length === 0) {
      throw new BadRequestException('Table type questions must have at least one column');
    }

    // Validate each column
    for (const column of question.tableConfig.columns) {
      if (!column.id || !column.label || !column.type) {
        throw new BadRequestException('Table columns must have id, label, and type');
      }

      // Validate column type
      const validTypes = ['text', 'number', 'date', 'select', 'checkbox'];
      if (!validTypes.includes(column.type)) {
        throw new BadRequestException(`Invalid column type: ${column.type}. Must be one of: ${validTypes.join(', ')}`);
      }

      // Validate select/checkbox columns have options
      if ((column.type === 'select' || column.type === 'checkbox') && (!column.options || column.options.length === 0)) {
        throw new BadRequestException(`${column.type} columns must have options`);
      }

      // Validate number column constraints
      if (column.type === 'number' && column.validation) {
        if (column.validation.min !== undefined && column.validation.max !== undefined) {
          if (column.validation.min > column.validation.max) {
            throw new BadRequestException('Minimum value cannot be greater than maximum value');
          }
        }
      }
    }

    // Validate table configuration
    if (question.tableConfig !== undefined) {
      // Validate columns
      if (question.tableConfig.columns && question.tableConfig.columns.length === 0) {
        throw new BadRequestException('Table must have at least one column');
      }
      
      // Validate rows for template mode
      if (question.tableConfig.mode === 'template' && 
          (!question.tableConfig.rows || question.tableConfig.rows.length === 0)) {
        throw new BadRequestException('Template table must have at least one predefined row');
      }
    }
  }
}
