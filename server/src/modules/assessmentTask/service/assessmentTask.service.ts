import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { BaseService } from "src/core/service/base.service";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { Transactional } from "src/core/decorators/transaction-decorator";
import { DATABASE_CONSTANTS } from "src/core/database/constant";
import { QuestionnaireService } from "src/modules/questionaire/services/questionnaire.service";
import { ProjectService } from "src/modules/project/service/project.service";
import { AssessmentTaskDAO } from "../dao/assessmentTask.dao";
import { AssessmentTaskDTO, EvidenceDto } from "../dtos/assessmentTask.dto";
import { userResponseDto } from "src/modules/project/dtos/updateProject.dto";
import {
  QuestionDto,
  QuestionnaireDto,
} from "src/modules/questionaire/dto/questionnaire.dto";
import { RocAssetControlService } from "src/modules/rocAssetControl/service/rocAssetControl.service";
import { RocAssetControlQstnService } from "src/modules/rocAssetControlQstn/service/rocAssetControlQstn.service";
import { BranchingLogic } from "src/modules/questionaire/model/branching-logic.interface";
import { EvaluateDto } from "src/modules/questionaire/dto/EvaluateDto.dto";
import { BranchEvaluator } from "src/modules/questionaire/classes/branch-evaluator";
import { UserContext } from "src/core/contexts/user.context";
import { UserService } from "src/modules/user/services/user.service";
import { OutboxService } from "src/core/outbox/services/outbox.service";
import { AssignTaskEvent } from "src/core/domain-events/assignTask-events";
import { AepocCreated } from "src/core/domain-events/aepocCreate-events";
import { UserRole, UserStatus } from "src/modules/authentication/Constant";

@Injectable()
export class AssessmentTaskService extends BaseService {
  constructor(
    @InjectConnection() connection: Connection,
    @Inject(DATABASE_CONSTANTS.AUDIT_DAO)
    private readonly AssessmentTaskDAO: AssessmentTaskDAO,
    private readonly questionairService: QuestionnaireService,
    private readonly projectService: ProjectService,
    private readonly rocAssetControl: RocAssetControlService,
    private readonly rocAssetControlQstn: RocAssetControlQstnService,
    private readonly userService: UserService,
    private readonly outBoxService: OutboxService,
    private readonly RocAssetControlService : RocAssetControlService
  ) {
    super(connection);
  }

  @Transactional()
  async createAssesment(auditData: AssessmentTaskDTO) {
    const questionair = await this.questionairService.getQuestionnaireById(
      auditData.questionnaireId
    );
    if (questionair) {
      auditData.questionnaire = questionair;
    }

    const response = await this.AssessmentTaskDAO.create(auditData);
    const projectDetails = await this.projectService.getProjectById(
      auditData.projectId
    );
    const deviceObj = {
      deviceRefName: response.deviceRefName,
      deviceType: response.deviceType,
      questionnaireId: auditData.questionnaireId,
      department: response.department,
      primaryAEStakeholderId: auditData.primaryAEStakeholderId,
      ipAddress: response.ipAddress,
      id: response.id,
    };
    projectDetails.device = [...(projectDetails.device || []), deviceObj];
    await this.projectService.updateProjectDevice(
      auditData.projectId,
      projectDetails
    );
    if (response) {
      return {
        message: "Audit Created successfully",
        audit: response,
      };
    }
  }

  async allAssesment(id: string): Promise<AssessmentTaskDTO[]> {
    const filter = {
      projectId: id,
    };
    return await this.AssessmentTaskDAO.find(filter);
  }

  async allAssesmentbyAEStakeholder(
    projectId: string,
    primaryAEStakeholderId: string
  ) {
    const data = await this.AssessmentTaskDAO.aggregate([
      {
        $match: {
          projectId,
          primaryAEStakeholderId,
        },
      },
      {
        $addFields: {
          totalQuestionCount: {
            $size: {
              $ifNull: ["$questionnaire.questions", []],
            },
          },
          answeredQuestionCount: {
            $size: {
              $filter: {
                input: "$questionnaire.questions",
                as: "question",
                cond: {
                  $and: [
                    { $ne: ["$$question.userResponse", null] },
                    { $ne: ["$$question.userResponse", ""] },
                    { $ne: ["$$question.userResponse", undefined] },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          hasAllUserResponses: {
            $eq: ["$totalQuestionCount", "$answeredQuestionCount"],
          },
        },
      },
      {
        $project: {
          id: "$_id",
          projectId: 1,
          department: 1,
          deviceRefName: 1,
          deviceType: 1,
          primaryAEStakeholderId: 1,
          evidences: 1,
          createDtTime: 1,
          hasAllUserResponses: 1,
          "questionnaire.questions": 1,
          "questionnaire.currentQuestionTracker": 1,
          "questionnaire.isCompletedAllQuestions": 1,
          "questionnaire.complianceType": 1,
          "questionnaire.title": 1,
          "questionnaire.description": 1,
          "questionnaire.id": 1,
        },
      },
    ]);
    return data;
  }
  
async allAssesmentStakeholders(id: string) {
  const filter = {
    projectId: id
  };

  const projectDetails = await this.projectService.getProjectById(id);
  const devices = await this.AssessmentTaskDAO.find(filter);
  const gaps = await this.RocAssetControlService.getStakeholderGaps(id);

  const assessorList = projectDetails?.aeInternalAssessors || [];

  // Add department to each filteredGap based on AEInternalAssessor
  const enrichedFilteredGaps = gaps?.filteredGaps?.map((gap) => {
    const assessor = assessorList.find(
      (a) => a.email.toLowerCase() === gap.AEInternalAssessor.toLowerCase()
    );

    return {
      ...gap,
      department: assessor?.department || null
    };
  }) || [];

  return {
    devices,
    projectDetails,
    gaps: {
      ...gaps,
      filteredGaps: enrichedFilteredGaps
    }
  };
}


  async userResponse(updateDto: userResponseDto): Promise<AssessmentTaskDTO> {
    const { questionId, choiceValue, assessmentId } = updateDto;

    const assessment = await this.AssessmentTaskDAO.findById(assessmentId);
    if (!assessment) throw new Error("Assessment not found");

    const questionnaire = assessment.questionnaire as QuestionnaireDto;
    if (!questionnaire || !questionnaire.questions) {
      throw new Error("Questionnaire not found in assessment");
    }

    questionnaire.currentQuestionTracker = questionId;
    const updatedQuestions: QuestionDto[] = questionnaire.questions.map(
      (question) => {
        if (question._id === questionId) {
          // Handle table_type questions specially
          if (question.type === "table_type") {
            try {
              const tableData = Array.isArray(choiceValue) ? JSON.parse(choiceValue[0]) : JSON.parse(choiceValue);
              return {
                ...question,
                userResponse: JSON.stringify(tableData),
                tableData: tableData
              };
            } catch (error) {
              console.error('Error parsing table data:', error);
              return {
                ...question,
                userResponse: question.userResponse,
              };
            }
          }

          // Handle other question types
          let response: string;

          if (Array.isArray(choiceValue)) {
            response =
              question.type === "multiple_choice"
                ? choiceValue.join(", ")
                : choiceValue[0];
          } else {
            response = choiceValue;
          }

          return {
            ...question,
            userResponse: response,
          };
        }
        return question;
      }
    );

    const updatedQuestionnaire: QuestionnaireDto = {
      ...questionnaire,
      questions: updatedQuestions,
    };

    return await this.AssessmentTaskDAO.update(assessmentId, {
      questionnaire: updatedQuestionnaire,
    });
  }

  @Transactional()
  async uploadEvidence(id: string, evidenceDTO: EvidenceDto) {
    const existing = await this.AssessmentTaskDAO.findById(id);
    if (!existing) {
      throw new NotFoundException(`Assessment Task with id ${id} not found`);
    }

    const evidenceWithCategory = {
      ...evidenceDTO,
      evidenceCategory: evidenceDTO.evidenceCategory || "document",
      refName: evidenceDTO.refName || "",
      testingProcedure: evidenceDTO.testingProcedure || "",
      uploadedAt: evidenceDTO.uploadedAt || new Date(),
    };

    const updatedEvidences = [
      ...(existing.evidences || []),
      evidenceWithCategory,
    ];

    const updated = await this.AssessmentTaskDAO.update(id, {
      evidences: updatedEvidences,
    });

    return updated;
  }
  async submitResponseRoc(projectId: string, assessmentId: string) {
    const data: AssessmentTaskDTO =
      await this.AssessmentTaskDAO.findById(assessmentId);

    const {
      questionnaire,
      deviceRefName,
      deviceType,
      primaryAEStakeholderId,
      evidences,
    } = data;

    if(questionnaire){
      this.AssessmentTaskDAO.update(assessmentId, {questionnaire: {...questionnaire,isCompletedAllQuestions: true, currentQuestionTracker: ""}});
    }
    for (const q of questionnaire.questions || []) {
      const isExisting = await this.rocAssetControl.getFilterData({
        projectId,
        reqNo: q.requirements,
        subReqNo: q.subRequirements,
        controlNo: q.subControl,
        AEInternalAssessor: primaryAEStakeholderId,
        deviceType,
        deviceRef: deviceRefName,
        qstnrID: questionnaire.id,
      });

      if ((isExisting?.length || 0) === 0) {
        await this.rocAssetControl.create({
          assessmentId,
          projectId,
          reqNo: q.requirements,
          subReqNo: q.subRequirements,
          controlNo: q.subControl,
          AEInternalAssessor: primaryAEStakeholderId,
          deviceType,
          deviceRef: deviceRefName,
          qstnrID: questionnaire.id,
          qstnrName: questionnaire.title,
          qstnrDesc: questionnaire.description,
          deviceRefFinding: "",
          AIResponseSummary: "",
          evidences,
          identifiedGaps: [],
          evidenceReference: q.evidenceReference,
        });
      }

      const matchingEvidences = evidences.filter(
        (evidence) => evidence.questionId === q._id
      );

      await this.rocAssetControlQstn.create({
        projectId,
        deviceRef: deviceRefName,
        controlNo: q.subControl,
        qstnID: q._id,
        qstnDesc: q.text,
        response: q.userResponse || "NA",
        evidences: matchingEvidences.length > 0 ? matchingEvidences : [],
        evidenceReference: q.evidenceReference,
      });
    }

    return { status: true, message: "Response Submitted Successfully" };
  }

  async evaluateLogicTree({
    questionnaireId,
    responses,
    currentQuestionId,
    assesmentId,
    projectId,
  }: EvaluateDto) {
    const roles = UserContext.getInstance().getRoles();
    let assessment;
    let questionnaire;

    if (roles.includes("AEStakeholder")) {
      assessment = (await this.AssessmentTaskDAO.findById(assesmentId))
        .questionnaire;
      questionnaire = assessment;
    } else if (roles.includes("ClientPoC")) {
      assessment = (await this.projectService.getProjectById(projectId))
        .scopingQSTRNRData;
      questionnaire = assessment.find((q) => q.id === questionnaireId);
    }

    if (!questionnaire) {
      throw new NotFoundException(
        `Questionnaire with question ${currentQuestionId} not found`
      );
    }

    const question = questionnaire.questions.find(
      (q) => q._id.toString() === currentQuestionId
    );
    if (!question?.formBranchingLogic) {
      return false;
    }

    const fixMissingOperations = (logic: BranchingLogic): BranchingLogic => {
      if ("conditions" in logic && Array.isArray(logic.conditions)) {
        return {
          ...logic,
          operation: logic.operation || "AND", // default to AND
          conditions: logic.conditions.map(fixMissingOperations),
        };
      }
      return logic;
    };

    const evaluator = new BranchEvaluator(responses);
    const nextQuestionId = evaluator.evaluate({
      operation: "OR",
      conditions: question.formBranchingLogic as BranchingLogic[],
      next: null,
    });

    if (!nextQuestionId) {
      if (question.alwaysGoTo) {
        const fallbackQuestion = questionnaire.questions.find(
          (q) => q._id.toString() === question.alwaysGoTo
        );
        if (!fallbackQuestion) {
          throw new NotFoundException(
            `AlwaysGoTo question with ID "${question.alwaysGoTo}" not found`
          );
        }
        return fallbackQuestion;
      }
      return null;
    }

    const nextQuestion = questionnaire.questions.find(
      (q) => q._id.toString() === nextQuestionId
    );
    if (!nextQuestion) {
      throw new NotFoundException(
        `Next question with ID "${nextQuestionId}" not found`
      );
    }

    return nextQuestion;
  }

  async getGapEvidence(assessmentId: string) {
    const assessment = await this.AssessmentTaskDAO.findById(assessmentId);
    if (!assessment) {
      throw new NotFoundException(
        `Assessment with ID "${assessmentId}" not found`
      );
    }

    const questions = assessment.questionnaire?.questions || [];

    const fileUploadGaps = questions.filter(
      (q) =>
        q.type === "file_type" &&
        (!q.userResponse || q.userResponse.trim() === "")
    );

    return fileUploadGaps;
  }

  async deleteEvidence(
    assessmentId: string,
    questionId: string
  ): Promise<{ success: boolean; message: string }> {
    const assessment = await this.AssessmentTaskDAO.findById(assessmentId);
    if (!assessment) {
      throw new NotFoundException(
        `Assessment with ID ${assessmentId} not found.`
      );
    }

    const updatedEvidences = assessment.evidences.filter(
      (evidence) => evidence.questionId !== questionId
    );

    await this.AssessmentTaskDAO.update(assessmentId, {
      evidences: updatedEvidences,
    });

    return {
      success: true,
      message: `Evidence for question ${questionId} deleted.`,
    };
  }

  async getEvidenceUploaded(assessmentId: string) {
    const assessment = await this.AssessmentTaskDAO.findById(assessmentId);
    if (!assessment) {
      throw new NotFoundException(
        `Assessment with ID "${assessmentId}" not found`
      );
    }
    return assessment.evidences;
  }

  async sendEmailsToStakeholders(
    projectId: string,
    sendType: "latest" | "all",
    stakeholderEmails: string[]
  ) {
    const projectDetails = await this.projectService.getProjectById(projectId);
    if (!projectDetails) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    let tasksToProcess: AssessmentTaskDTO[] = [];

    if (sendType === "latest") {
      // Get the latest task for each stakeholder that hasn't had emails sent
      for (const email of stakeholderEmails) {
        const tasks = await this.AssessmentTaskDAO.find({
          projectId,
          primaryAEStakeholderId: email,
          emailSent: false,
        });

        if (tasks.length > 0) {
          // Get the latest task (most recently created)
          const latestTask = tasks.sort(
            (a, b) =>
              new Date(b.createDtTime).getTime() -
              new Date(a.createDtTime).getTime()
          )[0];
          tasksToProcess.push(latestTask);
        }
      }
    } else {
      // Get all tasks that haven't had emails sent
      tasksToProcess = await this.AssessmentTaskDAO.find({
        projectId,
        emailSent: false,
      });
    }

    const processedUsers = new Set<string>();
    const processedTasks = new Set<string>();
    const usersToAddToProject = new Set<string>(); 

    for (const task of tasksToProcess) {
      const email = task.primaryAEStakeholderId;
      if (!email || processedUsers.has(email)) continue;

      // Check if aeInternalAssessors exists and find the assessor details
      const assessorDetails = projectDetails.aeInternalAssessors?.find(
        (assessor: any) => assessor.email === email
      );

      if (!assessorDetails) {
        console.log(`Assessor details not found for email: ${email}`);
        continue;
      }

      let aeStakeHolder = await this.userService.findUserByEmail(email);
      let isNewUser = false;

      if (!aeStakeHolder) {
        isNewUser = true;

        const newUser: any = {
          username: assessorDetails.email,
          email: assessorDetails.email,
          password: "Test@123",
          name: assessorDetails.name,
          roles: [UserRole.AEStakeholder],
          countryCode: 91,
          mobileNumber: Number(assessorDetails.mobileNumber),
          status: UserStatus.Active,
          createdBy: "system",
          defaultPasswordchange: true,
        };

        const result = await this.userService.createUser(newUser);
        aeStakeHolder = result.data;
      }

      // Check if user is already assigned to the project
      const isUserAlreadyAssigned = projectDetails.assignedTo?.some(
        (assignedUser: any) =>
          assignedUser.id === aeStakeHolder.id &&
          assignedUser.role === UserRole.AEStakeholder
      );

      // Add to project if user is not already assigned (regardless of whether they are new to system or not)
      if (!isUserAlreadyAssigned) {
        const aeStakeHolderAssignment = {
          id: aeStakeHolder.id,
          name: aeStakeHolder.name,
          role: UserRole.AEStakeholder,
        };

        if (!projectDetails.assignedTo) {
          projectDetails.assignedTo = [];
        }
        projectDetails.assignedTo.push(aeStakeHolderAssignment);
        usersToAddToProject.add(email);
      }

      // Send appropriate email events
      if (isNewUser) {
        await this.outBoxService.publishDomainEvent(
          new AepocCreated([aeStakeHolder.id])
        );
      }

      // Always send task assignment email (for both new and existing users)
      await this.outBoxService.publishDomainEvent(
        new AssignTaskEvent([aeStakeHolder.id])
      );

      // Mark tasks as email sent
      const tasksForThisUser = await this.AssessmentTaskDAO.find({
        projectId,
        primaryAEStakeholderId: email,
        emailSent: false,
      });

      for (const taskToUpdate of tasksForThisUser) {
        await this.AssessmentTaskDAO.update(taskToUpdate.id, {
          emailSent: true,
        });
      }

      processedUsers.add(email);
    }

    // Only update project if there are new users to add
    if (usersToAddToProject.size > 0) {
      await this.projectService.updateProject(projectId, {
        __v: projectDetails.__v,
        assignedTo: Array.isArray(projectDetails.assignedTo)
          ? projectDetails.assignedTo.filter(
              (entity, index, self) =>
                index ===
                self.findIndex(
                  (e) => e.id === entity.id && e.role === entity.role
                )
            )
          : [],
      });
      await this.projectService.projectStageChange(projectId);
    }

    return {
      message: `Emails have been sent to ${processedUsers.size} stakeholders regarding ${tasksToProcess.length} tasks.${usersToAddToProject.size > 0 ? ` ${usersToAddToProject.size} users added to project assignment.` : ""}`,
      processedUsers: processedUsers.size,
      processedTasks: tasksToProcess.length,
      newUsersAdded: usersToAddToProject.size,
    };
  }

  async AssessmentTaskfindById(assessmentId: string) {
    const assessment = await this.AssessmentTaskDAO.findById(assessmentId);
    if (!assessment) {
      throw new NotFoundException(
        `Assessment with ID "${assessmentId}" not found`
      );
    }
    return assessment;
  }

  async assessmentEvidenceTracker(projectId: string) {
    const assessments = await this.AssessmentTaskDAO.find({ projectId });

    if (!assessments || assessments.length === 0) {
      throw new NotFoundException(
        `Assessment with ID "${projectId}" not found`
      );
    }

    const result = [];
    for (const assessment of assessments) {
      const {
        questionnaire,
        evidences = [],
        deviceRefName,
        deviceType,
        primaryAEStakeholderId,
      } = assessment;

      if (!questionnaire?.questions?.length) continue;

      for (const question of questionnaire.questions) {
        const evidenceMatch = evidences.find(
          (e) => e.questionId === question._id
        );
        console.log("Evidence Match:", evidenceMatch);
        result.push({
          id: question.subControl || "N/A",
          deviceRefName: deviceRefName || "N/A",
          deviceType: deviceType || "N/A",
          questionnaire: questionnaire.title || "N/A",
          question: question.text || "N/A",
          latestEvidence: evidenceMatch ? [evidenceMatch.name] : [],
          AEInternalAssessor: primaryAEStakeholderId || "N/A",
          SubmittedOn: evidenceMatch?.uploadedAt
            ? new Date(evidenceMatch.uploadedAt).toLocaleDateString("en-IN")
            : "N/A",
          Status: evidenceMatch ? "Uploaded" : "Missing",
        });
      }
    }

    return result;
  }


}
