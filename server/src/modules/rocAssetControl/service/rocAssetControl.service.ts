import {
  Injectable,
  Inject,
  ForbiddenException,
  forwardRef,
  NotFoundException,
} from "@nestjs/common";
import { BaseService } from "src/core/service/base.service";
import { HttpService } from "@nestjs/axios";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { DATABASE_CONSTANTS } from "src/core/database/constant";
import {
  IdentifiedGapDTO,
  RocAssetControlDTO,
} from "../dtos/rocAssetControl.dto";
import { RocAssetControlDAO } from "../dao/rocAssetControl.DAO";
import { EvidenceDto } from "src/modules/assessmentTask/dtos/assessmentTask.dto";
import { AssessmentTaskService } from "src/modules/assessmentTask/service/assessmentTask.service";
import { QuestionnaireService } from "src/modules/questionaire/services/questionnaire.service";
import { RocAssetControlQstnService } from "src/modules/rocAssetControlQstn/service/rocAssetControlQstn.service";
import { AxiosResponse } from "axios";
@Injectable()
export class RocAssetControlService extends BaseService {
  constructor(
    @InjectConnection() connection: Connection,
    @Inject(DATABASE_CONSTANTS.RocAssetControl_DAO)
    private readonly RocAssetControlDao: RocAssetControlDAO,

    @Inject(forwardRef(() => AssessmentTaskService))
    private readonly assessmentTaskService: AssessmentTaskService,
    private readonly rocAssetControlQstnService: RocAssetControlQstnService,
    private readonly httpService: HttpService
  ) {
    super(connection);
  }

  async create(data: RocAssetControlDTO): Promise<RocAssetControlDTO> {
    return await this.RocAssetControlDao.create(data);
  }

  async update(
    id: string,
    data: Partial<RocAssetControlDTO>
  ): Promise<RocAssetControlDTO> {
    return await this.RocAssetControlDao.update(id, data);
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    await this.RocAssetControlDao.delete(id);
    return { success: true, message: "RocData entry deleted successfully" };
  }

  async getData(
    projectId: string,
    reqNo: string,
    subReqNo: string,
    controlNo: string
  ): Promise<any[]> {
    const filter = { projectId, reqNo, subReqNo, controlNo };
    const rawData = await this.RocAssetControlDao.find(filter);

    const grouped = new Map<string, any>();

    for (const item of rawData) {
      const { deviceType, deviceRef, ...rest } = item;

      if (!grouped.has(deviceType)) {
        grouped.set(deviceType, {
          deviceType,
          deviceRef: [deviceRef],
          ...rest,
        });
      } else {
        const group = grouped.get(deviceType);
        if (!group.deviceRef.includes(deviceRef)) {
          group.deviceRef.push(deviceRef);
        }
      }
    }

    return Array.from(grouped.values());
  }

  async getDeviceData(projectId: string) {
    const deviceInfo = await this.RocAssetControlDao.aggregate([
      { $match: { projectId } },
      {
        $group: {
          _id: "$deviceType",
          deviceRefs: { $addToSet: "$deviceRef" }, // <-- ensures uniqueness
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          deviceRef: {
            $sortArray: {
              input: "$deviceRefs",
              sortBy: 1,
            },
          },
        },
      },
    ]);

    if (!deviceInfo || deviceInfo.length === 0) {
      return {
        deviceInfo: [],
        defaultControl: null,
      };
    }
    const firstCategory = deviceInfo[0];
    const firstDeviceRef = firstCategory.deviceRef?.[0];

    if (!firstDeviceRef) {
      return {
        deviceInfo,
        defaultControl: null,
      };
    }

    const [defaultDoc] = await this.RocAssetControlDao.aggregate([
      {
        $match: {
          projectId,
          deviceType: firstCategory.category,
          deviceRef: firstDeviceRef,
        },
      },
      { $limit: 1 },
    ]);

    return {
      deviceInfo,
      defaultControl: defaultDoc || null,
    };
  }

  async getDeviceDataRef(
    projectId: string,
    deviceType: string,
    deviceRef: string
  ) {
    const groupedControls = await this.RocAssetControlDao.aggregate([
      { $match: { projectId, deviceType, deviceRef } },
      { $group: { _id: "$subReqNo", controls: { $push: "$controlNo" } } },
      { $project: { _id: 0, subReq: "$_id", controls: 1 } },
      { $sort: { subReq: 1 } },
    ]);

    const firstControlDoc = groupedControls?.[0]?.controls?.[0]
      ? await this.RocAssetControlDao.findOne({
          controlNo: groupedControls[0].controls[0],
          projectId,
          deviceType,
          deviceRef,
        })
      : null;

    return { groupedControls, firstControlDoc };
  }

  async getDeviceDataControl(
    projectId: string,
    deviceType: string,
    deviceRef: string,
    subReqNo: string,
    controlNo: string
  ) {
    const filter = {
      projectId,
      deviceType,
      deviceRef,
      subReqNo,
      controlNo,
    };
    const response = await this.RocAssetControlDao.find(filter);
    return response;
  }

  async getAEDataControl(projectId: string) {
    const docs = await this.RocAssetControlDao.aggregate([
      { $match: { projectId } },
      {
        $addFields: {
          reqSort: {
            $toInt: {
              $arrayElemAt: [{ $split: ["$reqNo", "-"] }, 1], // "Req-1" → 1
            },
          },
          subReqParts: {
            $split: [
              { $arrayElemAt: [{ $split: ["$subReqNo", "-"] }, 2] },
              ".",
            ],
          },
          controlParts: {
            $split: [
              { $arrayElemAt: [{ $split: ["$controlNo", "-"] }, 1] },
              ".",
            ],
          },
        },
      },
      {
        $addFields: {
          subReqMainSort: { $toInt: { $arrayElemAt: ["$subReqParts", 0] } },
          subReqSubSort: { $toInt: { $arrayElemAt: ["$subReqParts", 1] } },

          controlMainSort: { $toInt: { $arrayElemAt: ["$controlParts", 0] } },
          controlSubSort: { $toInt: { $arrayElemAt: ["$controlParts", 1] } },
          controlSubSubSort: { $toInt: { $arrayElemAt: ["$controlParts", 2] } },
        },
      },
      {
        $project: {
          AEInternalAssessor: 1,
          reqNo: 1,
          subReqNo: 1,
          controlNo: 1,
          qstnrName: 1,
          stakeholder: 1,
          deviceType: 1,
          deviceRef: 1,
          qstnDesc: 1,
          response: 1,
          reqSort: 1,
        },
      },
      {
        $sort: {
          reqSort: 1,
          subReqMainSort: 1,
          subReqSubSort: 1,
          controlMainSort: 1,
          controlSubSort: 1,
          controlSubSubSort: 1,
        },
      },
    ]);

    if (!docs.length) {
      return {
        primaryAEStakeholder: [],
        firstData: null,
      };
    }

    const uniqueStakeholders: string[] = [];
    const seen = new Set<string>();
    let firstData: any = null;

    for (const doc of docs) {
      const stakeholder = doc.AEInternalAssessor;

      if (stakeholder && !seen.has(stakeholder)) {
        seen.add(stakeholder);
        uniqueStakeholders.push(stakeholder);

        if (!firstData) {
          firstData = doc;
        }
      }
    }

    return {
      primaryAEStakeholder: uniqueStakeholders,
      firstData,
    };
  }

  async getAEDataControlData(projectId: string, AEInternalAssessor: string) {
    const filter = { projectId, AEInternalAssessor };
    const flatData = await this.RocAssetControlDao.find(filter);

    const map = new Map<
      string,
      { title: string; controls: { title: string }[] }
    >();

    for (const item of flatData) {
      if (!map.has(item.subReqNo)) {
        map.set(item.subReqNo, { title: item.subReqNo, controls: [] });
      }

      const group = map.get(item.subReqNo)!;

      if (!group.controls.some((ctrl) => ctrl.title === item.controlNo)) {
        group.controls.push({ title: item.controlNo });
      }
    }

    const groupedData = Array.from(map.values()).sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { numeric: true })
    );

    return {
      flatData,
      groupedData,
    };
  }

  async getAEDataSubControlData(
    projectId: string,
    AEInternalAssessor: string,
    subReqNo: string,
    controlNo: string
  ) {
    const filter = { projectId, AEInternalAssessor, subReqNo, controlNo };
    return await this.RocAssetControlDao.find(filter);
  }

  async getFilterData(filter) {
    return await this.RocAssetControlDao.find(filter);
  }

  async updateRefFinding(
    deviceRef: string,
    controlNo: string,
    data: Partial<RocAssetControlDTO>
  ) {
    const filter: { deviceRef: string; controlNo: string } = {
      deviceRef,
      controlNo,
    };
    const getData = await this.RocAssetControlDao.findOne(filter);
    if (!getData) {
      throw new Error("Roc Asset Controlo Not Found.");
    }
    await this.RocAssetControlDao.update(getData.id, data);
    return { message: "Ref Finding Saved Succesfully." };
  }

  async updateGaps(
    deviceRef: string,
    controlNo: string,
    data: Partial<RocAssetControlDTO>
  ) {
    const { identifiedGaps } = data;
    const filter: { deviceRef: string; controlNo: string } = {
      deviceRef,
      controlNo,
    };

    const getData = await this.RocAssetControlDao.findOne(filter);
    if (!getData) {
      throw new Error("Roc Asset Controlo Not Found.");
    }

    const dataa = await this.RocAssetControlDao.update(getData.id, data);
    return { message: "Identified Gaps Saved Succesfully.", dataa };
  }

  async updateAssessmentEvidences(
    deviceRef: string,
    controlNo: string,
    evidences: EvidenceDto[]
  ) {
    const filter = {
      controlNo,
      deviceRef,
    };
    const assessment: RocAssetControlDTO =
      await this.RocAssetControlDao.findOne(filter);
    if (!assessment) throw new Error("Asssessment not found");

    const mergedEvidences = [
      ...(assessment.evidences || []),
      ...evidences.map((evidence) => ({
        ...evidence,
        evidenceCategory: evidence.evidenceCategory || "document",
        refName: evidence.refName || "",
        uploadedAt: evidence.uploadedAt || new Date(),
      })),
    ];

    return await this.RocAssetControlDao.update(assessment.id, {
      evidences: mergedEvidences,
    });
  }

  async getAssessmentEvidences(
    controlNo: string,
    deviceRef: string
  ): Promise<EvidenceDto[]> {
    const filter = {
      controlNo,
      deviceRef,
    };

    const assessment: RocAssetControlDTO =
      await this.RocAssetControlDao.findOne(filter);
    if (!assessment) throw new Error("Asssessment not found");

    const fullAssessment = await this.RocAssetControlDao.findById(
      assessment.id
    );
    const evidences = fullAssessment?.evidences ?? [];
    return evidences;
  }

  async getOldAssetEvidences(
    controlNo: string,
    deviceRef: string
  ): Promise<EvidenceDto[]> {
    const filter = {
      controlNo,
      deviceRef,
    };
    const assessment: RocAssetControlDTO =
      await this.RocAssetControlDao.findOne(filter);
    if (!assessment) throw new Error("Asssessment not found");

    const fullAssessment = await this.RocAssetControlDao.findById(
      assessment.id
    );
    const evidences = fullAssessment?.evidences ?? [];
    return evidences.filter((evidence) => evidence.questionId != "new");
  }

  async getAllAssetEvidences(
    controlNo: string,
    deviceRef: string
  ): Promise<EvidenceDto[]> {
    const filter = {
      controlNo,
      deviceRef,
    };
    const assessment: RocAssetControlDTO =
      await this.RocAssetControlDao.findOne(filter);
    if (!assessment) throw new Error("Asssessment not found");

    const fullAssessment = await this.RocAssetControlDao.findById(
      assessment.id
    );
    return fullAssessment?.evidences ?? [];
  }

  async getAllControlEvidences(controlNo: string): Promise<EvidenceDto[]> {
    const filter = {
      controlNo,
    };
    const assessments: RocAssetControlDTO[] =
      await this.RocAssetControlDao.find(filter);
    if (!assessments || assessments.length === 0)
      throw new Error("Assessments not found");

    // Flatten all evidences from all assessments
    const allEvidences: EvidenceDto[] = [];
    assessments.forEach((assessment) => {
      if (assessment.evidences && Array.isArray(assessment.evidences)) {
        allEvidences.push(...assessment.evidences);
      }
    });

    return allEvidences;
  }

  async getUniqueReqNo(projectId: string, reqNo: string) {
    const filter = { projectId, reqNo };
    const docs = await this.RocAssetControlDao.find(filter);

    const filteredDocs = docs.filter(
      (doc) =>
        Array.isArray(doc.identifiedGaps) && doc.identifiedGaps.length > 0
    );
    return filteredDocs;
  }
  async getreqData(projectId: string) {
    const filter = { projectId };
    const docs = await this.RocAssetControlDao.find(filter);

    const filteredDocs = docs.filter(
      (doc) =>
        Array.isArray(doc.identifiedGaps) && doc.identifiedGaps.length > 0
    );

    const groupedByReqNo: Record<string, any> = {};
    let totalNoOfGaps = 0;
    let PendingQsa = 0;
    let PendingClient = 0;

    for (const doc of filteredDocs) {
      const reqNo = doc.reqNo;

      if (!groupedByReqNo[reqNo]) {
        groupedByReqNo[reqNo] = {
          reqNo,
          totalGaps: 0,
          completedGaps: 0,
          description: doc.qstnrDesc || "",
        };
      }

      const gapCount = doc.identifiedGaps.length;
      const completed = doc.identifiedGaps.filter(
        (g) => g.status?.toLowerCase() === "completed"
      );
      const qsaGaps = doc.identifiedGaps.filter(
        (g) => g.status === "Pending QSA"
      );
      const clientGaps = doc.identifiedGaps.filter(
        (g) => g.status === "Pending Client"
      );
      groupedByReqNo[reqNo].totalGaps += gapCount;
      groupedByReqNo[reqNo].completedGaps += completed.length;
      totalNoOfGaps += gapCount;
      PendingQsa += qsaGaps.length;
      PendingClient += clientGaps.length;
    }

    return {
      PendingQsa,
      PendingClient,
      totalNoOfGaps,
      data: Object.values(groupedByReqNo),
    };
  }

  async getDevicetypeGaps(projectId: string, deviceType: string) {
    const filter = { projectId, deviceType };
    const docs = await this.RocAssetControlDao.find(filter);

    const filteredDocs = docs.filter(
      (doc) =>
        Array.isArray(doc.identifiedGaps) && doc.identifiedGaps.length > 0
    );
    return filteredDocs;
  }
  async getOneDeviceRefGaps(projectId: string, deviceRef: string) {
    const filter = { projectId, deviceRef };
    const docs = await this.RocAssetControlDao.find(filter);

    const filteredDocs = docs.filter(
      (doc) =>
        Array.isArray(doc.identifiedGaps) && doc.identifiedGaps.length > 0
    );
    return filteredDocs;
  }

  async getAllDevicetypesGaps(projectId: string) {
    const filter = { projectId };
    const docs = await this.RocAssetControlDao.find(filter);

    const filteredDocs = docs.filter(
      (doc) =>
        doc.deviceType &&
        Array.isArray(doc.identifiedGaps) &&
        doc.identifiedGaps.length > 0
    );

    const deviceSummary: Record<
      string,
      { deviceType: string; totalGaps: number; completedGaps: number }
    > = {};
    let totalNoOfGaps = 0;

    for (const doc of filteredDocs) {
      const { deviceType, identifiedGaps } = doc;

      if (!deviceSummary[deviceType]) {
        deviceSummary[deviceType] = {
          deviceType,
          totalGaps: 0,
          completedGaps: 0,
        };
      }

      const gapCount = identifiedGaps.length;
      const completedCount = identifiedGaps.filter(
        (g) => g.status?.toLowerCase() === "completed"
      ).length;

      deviceSummary[deviceType].totalGaps += gapCount;
      deviceSummary[deviceType].completedGaps += completedCount;
      totalNoOfGaps += gapCount;
    }

    return {
      totalNoOfGaps,
      data: Object.values(deviceSummary),
    };
  }

  async getDeviceRefGaps(projectId: string, deviceType: string) {
    const filter = { projectId, deviceType };
    const docs = await this.RocAssetControlDao.find(filter);

    const filteredDocs = docs.filter(
      (doc) =>
        doc.deviceType === deviceType &&
        Array.isArray(doc.identifiedGaps) &&
        doc.identifiedGaps.length > 0
    );

    const deviceRefSummary: Record<
      string,
      { deviceRef: string; totalGaps: number; completedGaps: number }
    > = {};

    let totalNoOfGaps = 0;

    for (const doc of filteredDocs) {
      const { deviceRef, identifiedGaps } = doc;

      if (!deviceRefSummary[deviceRef]) {
        deviceRefSummary[deviceRef] = {
          deviceRef,
          totalGaps: 0,
          completedGaps: 0,
        };
      }

      const gapCount = identifiedGaps.length;
      const completedCount = identifiedGaps.filter(
        (g) => g.status?.toLowerCase() === "completed"
      ).length;

      deviceRefSummary[deviceRef].totalGaps += gapCount;
      deviceRefSummary[deviceRef].completedGaps += completedCount;
      totalNoOfGaps += gapCount;
    }

    return {
      totalNoOfGaps,
      data: Object.values(deviceRefSummary),
    };
  }

  async getAllStakeholderGaps(projectId: string) {
    const filter = { projectId };
    const docs = await this.RocAssetControlDao.find(filter);

    const filteredDocs = docs.filter(
      (doc) =>
        doc.AEInternalAssessor &&
        Array.isArray(doc.identifiedGaps) &&
        doc.identifiedGaps.length > 0
    );

    const deviceSummary: Record<
      string,
      { AEInternalAssessor: string; totalGaps: number; completedGaps: number }
    > = {};
    let totalNoOfGaps = 0;

    for (const doc of filteredDocs) {
      const { AEInternalAssessor, identifiedGaps } = doc;

      if (!deviceSummary[AEInternalAssessor]) {
        deviceSummary[AEInternalAssessor] = {
          AEInternalAssessor,
          totalGaps: 0,
          completedGaps: 0,
        };
      }

      const gapCount = identifiedGaps.length;
      const completedCount = identifiedGaps.filter(
        (g) => g.status?.toLowerCase() === "completed"
      ).length;

      deviceSummary[AEInternalAssessor].totalGaps += gapCount;
      deviceSummary[AEInternalAssessor].completedGaps += completedCount;
      totalNoOfGaps += gapCount;
    }

    return {
      totalNoOfGaps,
      data: Object.values(deviceSummary),
    };
  }

  async getOneStakeholderRevise(projectId: string, AEInternalAssessor: string) {
    const filter = { projectId, AEInternalAssessor };
    const docs = await this.RocAssetControlDao.find(filter);

    // Filter docs with at least one identifiedGap
    const filteredDocs = docs.filter(
      (doc) =>
        Array.isArray(doc.identifiedGaps) && doc.identifiedGaps.length > 0
    );

    // Group by assessmentId + deviceType + deviceRef
    const grouped = new Map<string, any>();

    for (const doc of filteredDocs) {
      const key = `${doc.assessmentId}__${doc.deviceType}__${doc.deviceRef}__${doc.controlNo}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          assessmentId: doc.assessmentId,
          deviceType: doc.deviceType,
          deviceRef: doc.deviceRef,
          projectId: doc.projectId,
          qstnrId: doc.qstnrID,
          controlNo: doc.controlNo,
          identifiedGaps: [],
          evidences: [],
        });
      }

      const group = grouped.get(key);
      group.identifiedGaps.push(...(doc.identifiedGaps || []));
      group.evidences.push(...(doc.evidences || []));
    }

    // Convert map values to array
    return Array.from(grouped.values());
  }
  async getStakeholderGaps(projectId: string) {
    const filter = { projectId };
    const docs = await this.RocAssetControlDao.find(filter);

    const filteredDocs = docs.filter(
      (doc) =>
        doc.AEInternalAssessor &&
        Array.isArray(doc.identifiedGaps) &&
        doc.identifiedGaps.length > 0
    );

    const filteredGaps = docs.filter(
      (doc) =>
        Array.isArray(doc.identifiedGaps) && doc.identifiedGaps.length > 0
    );

    const deviceSummary: Record<
      string,
      { AEInternalAssessor: string; totalGaps: number; completedGaps: number }
    > = {};
    let totalNoOfGaps = 0;

    for (const doc of filteredDocs) {
      const { AEInternalAssessor, identifiedGaps } = doc;

      if (!deviceSummary[AEInternalAssessor]) {
        deviceSummary[AEInternalAssessor] = {
          AEInternalAssessor,
          totalGaps: 0,
          completedGaps: 0,
        };
      }

      const gapCount = identifiedGaps.length;
      const completedCount = identifiedGaps.filter(
        (g) => g.status?.toLowerCase() === "completed"
      ).length;

      deviceSummary[AEInternalAssessor].totalGaps += gapCount;
      deviceSummary[AEInternalAssessor].completedGaps += completedCount;
      totalNoOfGaps += gapCount;
    }

    return {
      totalNoOfGaps,
      data: Object.values(deviceSummary),
      filteredGaps,
    };
  }

  async getOneStakeholderGaps(projectId: string, AEInternalAssessor: string) {
    const filter = { projectId, AEInternalAssessor };
    const docs = await this.RocAssetControlDao.find(filter);

    const filteredDocs = docs.filter(
      (doc) =>
        Array.isArray(doc.identifiedGaps) && doc.identifiedGaps.length > 0
    );
    return filteredDocs;
  }

  async getAssessmentGaps(
    controlNo: string,
    deviceRef: string
  ): Promise<IdentifiedGapDTO[]> {
    const filter = {
      controlNo,
      deviceRef,
    };

    const assessment: RocAssetControlDTO =
      await this.RocAssetControlDao.findOne(filter);
    if (!assessment) throw new Error("Asssessment not found");

    const fullAssessment = await this.RocAssetControlDao.findById(
      assessment.id
    );
    return fullAssessment?.identifiedGaps ?? [];
  }

  async getAsssessorRevise(projectId: string, AEInternalAssessor: string) {
    const filter = { projectId, AEInternalAssessor };
    const docs = await this.RocAssetControlDao.find(filter);

    const filteredDocs = docs.filter(
      (doc) =>
        Array.isArray(doc.identifiedGaps) && doc.identifiedGaps.length > 0
    );

    const grouped = new Map<string, any>();

    for (const doc of filteredDocs) {
      const key = `${doc.assessmentId}__${doc.deviceType}__${doc.deviceRef}__${doc.controlNo}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          assessmentId: doc.assessmentId,
          deviceType: doc.deviceType,
          deviceRef: doc.deviceRef,
          projectId: doc.projectId,
          qstnrId: doc.qstnrID,
          controlNo: doc.controlNo,
          identifiedGaps: [],
          evidences: [],
        });
      }

      const group = grouped.get(key);
      group.identifiedGaps.push(...(doc.identifiedGaps || []));
      group.evidences.push(...(doc.evidences || []));
    }

    const results = [];

    // Step 2: For each group, fetch assessmentTask and match questions
    for (const group of grouped.values()) {
      console.log(
        `Processing group: ${group.assessmentId}__${group.deviceType}__${group.deviceRef}__${group.controlNo}`
      );

      // Fetch the assessment task for this specific group
      const assessmentTask =
        await this.assessmentTaskService.AssessmentTaskfindById(
          group.assessmentId
        );
      const allQuestions = assessmentTask?.questionnaire?.questions || [];
      console.log(
        `Found ${allQuestions.length} questions for assessment ${group.assessmentId} with questionnaire ${assessmentTask?.questionnaire?._id}`
      );

      const matchedQuestionIds = new Set<string>();

      for (const gap of group.identifiedGaps) {
        const allEvidence = [
          ...(gap.evidences || []),
          ...(gap.oldEvidence || []),
        ];
        console.log(`Processing gap with ${allEvidence.length} evidence items`);

        for (const ev of allEvidence) {
          console.log(
            `Looking for question: ${ev.questionId} with questionnaire: ${ev.qstnrId}`
          );

          // Only match questions that belong to the same assessment task
          let matched = allQuestions.find(
            (q) => q._id === ev.questionId && q.questionnaireId === ev.qstnrId
          );

          // If no match found, try matching just by questionId but only within this assessment's questions
          if (!matched) {
            matched = allQuestions.find((q) => q._id === ev.questionId);
          }

          if (matched) {
            console.log(
              `Matched question: ${matched._id} - ${matched.text?.substring(0, 50)}...`
            );
            matchedQuestionIds.add(matched._id);
          } else {
            console.log(
              `No match found for question: ${ev.questionId} in assessment ${group.assessmentId}`
            );
          }
        }
      }

      const matchedQuestions = allQuestions.filter((q) =>
        matchedQuestionIds.has(q._id)
      );
     
      results.push({
        ...group,
        matchedQuestions,
      });
    }

    return results;
  }

  async getAsssessorReviseByAssessment(
    projectId: string,
    AEInternalAssessor: string,
    assessmentId: string
  ) {
    const filter = { projectId, AEInternalAssessor, assessmentId };
    const docs = await this.RocAssetControlDao.find(filter);

    const filteredDocs = docs.filter(
      (doc) =>
        Array.isArray(doc.identifiedGaps) && doc.identifiedGaps.length > 0
    );

    const grouped = new Map<string, any>();

    for (const doc of filteredDocs) {
      const key = `${doc.assessmentId}__${doc.deviceType}__${doc.deviceRef}__${doc.controlNo}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          assessmentId: doc.assessmentId,
          deviceType: doc.deviceType,
          deviceRef: doc.deviceRef,
          projectId: doc.projectId,
          qstnrId: doc.qstnrID,
          controlNo: doc.controlNo,
          identifiedGaps: [],
          evidences: [],
        });
      }

      const group = grouped.get(key);
      group.identifiedGaps.push(...(doc.identifiedGaps || []));
      group.evidences.push(...(doc.evidences || []));
    }

    const results = [];

    // Step 2: For each group, fetch assessmentTask and match questions
    for (const group of grouped.values()) {
      console.log(
        `Processing group: ${group.assessmentId}__${group.deviceType}__${group.deviceRef}__${group.controlNo}`
      );

      // Fetch the assessment task for this specific group
      const assessmentTask =
        await this.assessmentTaskService.AssessmentTaskfindById(
          group.assessmentId
        );
      const allQuestions = assessmentTask?.questionnaire?.questions || [];
      console.log(
        `Found ${allQuestions.length} questions for assessment ${group.assessmentId} with questionnaire ${assessmentTask?.questionnaire?._id}`
      );

      const matchedQuestionIds = new Set<string>();

      for (const gap of group.identifiedGaps) {
        const allEvidence = [
          ...(gap.evidences || []),
          ...(gap.oldEvidence || []),
        ];
        console.log(`Processing gap with ${allEvidence.length} evidence items`);

        for (const ev of allEvidence) {
          console.log(
            `Looking for question: ${ev.questionId} with questionnaire: ${ev.qstnrId}`
          );

          // Only match questions that belong to the same assessment task
          let matched = allQuestions.find(
            (q) => q._id === ev.questionId && q.questionnaireId === ev.qstnrId
          );

          // If no match found, try matching just by questionId but only within this assessment's questions
          if (!matched) {
            matched = allQuestions.find((q) => q._id === ev.questionId);
          }

          if (matched) {
            console.log(
              `Matched question: ${matched._id} - ${matched.text?.substring(0, 50)}...`
            );
            matchedQuestionIds.add(matched._id);
          } else {
            console.log(
              `No match found for question: ${ev.questionId} in assessment ${group.assessmentId}`
            );
          }
        }
      }

      const matchedQuestions = allQuestions.filter((q) =>
        matchedQuestionIds.has(q._id)
      );
      console.log(
        `Final matched questions count: ${matchedQuestions.length} for assessment ${group.assessmentId}`
      );

      results.push({
        ...group,
        matchedQuestions,
      });
    }

    return results;
  }

  async submitresolutionComment(
    projectId: string,
    controlNo: string,
    selectedReviseQstnId: string,
    resolution: string
  ) {
    console.log("Found Docs:", resolution);
    const docs = await this.RocAssetControlDao.find({ projectId, controlNo });

    for (const doc of docs) {
      let modified = false;

      for (const gap of doc.identifiedGaps || []) {
        const hasMatchingEvidence = (gap.oldEvidence || []).some(
          (evidence) => evidence.questionId === selectedReviseQstnId
        );

        if (hasMatchingEvidence) {
          // Set or update resolutionComment
          gap.resolutionComment = resolution;
          modified = true;
        }
      }

      if (modified) {
        // Normalize the ID for updating
        const normalizedId =
          (doc._id as any)?.$oid ?? doc._id?.toString?.() ?? doc.id;

        if (!normalizedId) {
          console.warn("Skipping update: Invalid document ID", doc);
          continue;
        }

        const updatedDoc = await this.RocAssetControlDao.update(normalizedId, {
          identifiedGaps: doc.identifiedGaps,
        });

        console.log("Updated document:", updatedDoc);
      }
    }

    return { message: "Resolution comment updated successfully" };
  }

async GenerateAIResponse(
  projectId: string,
  controlNo: string,
  deviceRef: string,
  deviceType: string,
  requirementDesc: string,
  subRequirementDesc: string, 
  controlDesc: string
) {
  const filter = { projectId, controlNo, deviceRef };
  const response = await this.RocAssetControlDao.findOne(filter);

  // Case 1: Already generated — just return it
  if (response?.AIResponseSummary && response.AIResponseSummary.trim() !== "") {
    return response.AIResponseSummary;
  }


    const questionnaire =
      await this.rocAssetControlQstnService.getQuestionnaireById(
        projectId,
        controlNo,
        deviceRef
      );

    const requestBody = { 
      qas: questionnaire.map((qa: any) => (
      { text: qa.qstnDesc, userResponse: qa.response })), 
      control_id: controlNo, 
      control_description: controlDesc, 
      asset_type: deviceType, 
      requirement_description: requirementDesc, 
      subrequirement_description: subRequirementDesc 
    };
  console.log("Request Body for AI Service:", requestBody);
    try {
    // Call Python FastAPI service
    const aiRes = await this.httpService.axiosRef.post(
      "https://pi-audit-app.radpretation.ai/python-model/generate_summary",
       requestBody,
      { headers: { "Content-Type": "application/json" } }
    );
     const aiSummary = aiRes.data.summary;
    // Save AI response in DB for future calls
     await this.RocAssetControlDao.update(response.id, {
      AIResponseSummary: aiSummary,
    });

    return aiSummary;
} catch (err) {
  console.error("Error calling Python AI service:", err.message);
  throw new Error("Failed to generate AI response");
  }

}
 
}
