import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { PermissionsGuard } from "src/core/guards/permissions.guards";
import { RocAssetControlService } from "../service/rocAssetControl.service";
import { IdentifiedGapDTO, RocAssetControlDTO } from "../dtos/rocAssetControl.dto";
import { EvidenceDto } from "src/modules/assessmentTask/dtos/assessmentTask.dto";

@Controller("RocAssetControl")
export class RocAssetControlController {
  constructor(private readonly rocAssetControlService: RocAssetControlService) {}

  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Post("RocAssetControl-assessment")
  async createRocAssetControl(@Body() dto: RocAssetControlDTO): Promise<RocAssetControlDTO> {
    return await this.rocAssetControlService.create(dto);
  }

  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Patch(':id')
  async updateRocAssetControl(
    @Param('id') id: string,
    @Body() dto: Partial<RocAssetControlDTO>
  ): Promise<RocAssetControlDTO> {
    return await this.rocAssetControlService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Delete(':id')
  async deleteRocAssetControl(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    return await this.rocAssetControlService.delete(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('req-data/:projectId/:reqNo/:subReqNo/:controlNo')
  async getUniqueReqNos(@Param('projectId') projectId: string,
  @Param('reqNo') reqNo: string,
  @Param('subReqNo') subReqNo: string,
  @Param('controlNo') controlNo: string): Promise<RocAssetControlDTO[]> {
    return await this.rocAssetControlService.getData(projectId, reqNo, subReqNo, controlNo);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('device-data/:projectId')
  async getDeviceReferences(@Param('projectId') projectId: string) {
    return await this.rocAssetControlService.getDeviceData(projectId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('device-data/:projectId/:device/:deviceRef')
  async getDeviceData(@Param('projectId') projectId: string,
  @Param('device') device: string,
  @Param('deviceRef') deviceRef: string) {
    return await this.rocAssetControlService.getDeviceDataRef(projectId,device,deviceRef);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('device-data/:projectId/:device/:deviceRef/:subReqNo/:controlNo')
  async getDeviceDataControl(@Param('projectId') projectId: string,
  @Param('device') device: string,
  @Param('deviceRef') deviceRef: string,
  @Param('subReqNo') subReqNo: string,
  @Param('controlNo') controlNo: string) {
    return await this.rocAssetControlService.getDeviceDataControl(projectId,device,deviceRef,subReqNo,controlNo);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('ae-data/:projectId')
  async getAEInternalAssesor(@Param('projectId') projectId: string) {
    return await this.rocAssetControlService.getAEDataControl(projectId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('ae-data/:projectId/:AEInternalAssesor')
  async getAEInternalAssesorData(@Param('projectId') projectId: string,
  @Param('AEInternalAssesor') AEInternalAssesor: string) {
    return await this.rocAssetControlService.getAEDataControlData(projectId,AEInternalAssesor);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('ae-data/:projectId/:AEInternalAssesor/:subReq/:controlNo')
  async getAEInternalAssesorControlData(@Param('projectId') projectId: string,
  @Param('AEInternalAssesor') AEInternalAssesor: string,
  @Param('subReq') subReq: string,
  @Param('controlNo') controlNo: string) {
    return await this.rocAssetControlService.getAEDataSubControlData(projectId,AEInternalAssesor,subReq,controlNo);
  }

  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Post("devicereffinding/:deviceRef/:controlNo")
  async saveDeviceRefFinding(
  @Param('deviceRef') deviceRef: string,
  @Param('controlNo') controlNo: string,
  @Body() dto: {deviceRefFinding: string}) {
    return await this.rocAssetControlService.updateRefFinding(deviceRef,controlNo,dto);
  }

  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Post("identifiedGaps/:deviceRef/:controlNo")
  async saveIdentifiedGaps(
  @Param('deviceRef') deviceRef: string,
  @Param('controlNo') controlNo: string,
  @Body() dto: IdentifiedGapDTO[]) {
    return await this.rocAssetControlService.updateGaps(deviceRef,controlNo,{
    identifiedGaps: dto,
    });
  }

  @Patch("evidenceresponse/:controlNo/:deviceRef")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async updateEvidences(
    @Param("controlNo") controlNo: string,
    @Param("deviceRef") deviceRef: string,
    @Body() evidences: EvidenceDto[]
  ) {
    return await this.rocAssetControlService.updateAssessmentEvidences(deviceRef,controlNo,evidences);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('assessmntevidences/:controlNo/:deviceRef')
  async getAssetEvidences(
  @Param("controlNo") controlNo: string,
  @Param("deviceRef") deviceRef: string,) {
    return await this.rocAssetControlService.getAssessmentEvidences(controlNo,deviceRef);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('assessmntevidences-old/:controlNo/:deviceRef')
  async getOldAssetEvidences(
  @Param("controlNo") controlNo: string,
  @Param("deviceRef") deviceRef: string,) {
    return await this.rocAssetControlService.getOldAssetEvidences(controlNo,deviceRef);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('assessmntevidencesall/:controlNo/:deviceRef')
  async getAllAssetEvidences(
  @Param("controlNo") controlNo: string,
  @Param("deviceRef") deviceRef: string,) {
    return await this.rocAssetControlService.getAllAssetEvidences(controlNo,deviceRef);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('assessmnt-control-evidences/:controlNo')
  async getAllControlEvidences(
  @Param("controlNo") controlNo: string) {
    return await this.rocAssetControlService.getAllControlEvidences(controlNo);
  }

//find-alldevice-gaps based on category
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Get("find-alldevice-gaps/:projectId")
  async getAllDevicetypesGaps(
  @Param('projectId') projectId: string,
 ) {
    return await this.rocAssetControlService.getAllDevicetypesGaps(projectId);
  }

    @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Get("find-device-gaps/:projectId/:deviceType")
  async getDevicetypeGaps(
  @Param('projectId') projectId: string,
  @Param('deviceType') deviceType: string
 ) {
    return await this.rocAssetControlService.getDevicetypeGaps(projectId,deviceType);
  }

//find-deviceRef-gaps based on refrence
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Get("find-deviceRef-gaps/:projectId/:deviceType")
  async getDeviceRefGaps(
  @Param('projectId') projectId: string,
  @Param('deviceType') deviceType: string
 ) {
    return await this.rocAssetControlService.getDeviceRefGaps(projectId,deviceType);
  }

  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Get("find-OnedeviceRef-gaps/:projectId/:deviceRef")
  async getOneDeviceRefGaps(
  @Param('projectId') projectId: string,
  @Param('deviceRef') deviceRef: string
 ) {
    return await this.rocAssetControlService.getOneDeviceRefGaps(projectId,deviceRef);
  }

  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Get("find-allreq-data/:projectId")
  async getreqData(
  @Param('projectId') projectId: string,
 ) {
    return await this.rocAssetControlService.getreqData(projectId);
  }

  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Get("find-req-data/:reqNo/:projectId")
  async getUniqueReqNo(
  @Param('projectId') projectId: string,
  @Param('reqNo') reqNo: string
  ) {
    return await this.rocAssetControlService.getUniqueReqNo(projectId,reqNo);
  }

  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Get("find-Allstakeholder-Gaps/:projectId")
  async getAllStakeholderGaps(
  @Param('projectId') projectId: string,
  ) {
    return await this.rocAssetControlService.getAllStakeholderGaps(projectId);
  }


  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Get("find-stakeholder-Gaps/:projectId")
  async getStakeholderGaps(
  @Param('projectId') projectId: string,
  ) {
    return await this.rocAssetControlService.getStakeholderGaps(projectId);
  }


  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Get("find-Onestakeholder-Gaps/:projectId/:AEInternalAssessor")
  async getOneStakeholderGaps(
  @Param('projectId') projectId: string,
  @Param('AEInternalAssessor') AEInternalAssessor: string
  ) {
    return await this.rocAssetControlService.getOneStakeholderGaps(projectId,AEInternalAssessor);
  }
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Get("find-revise-Gaps/:projectId/:AEInternalAssessor")
  async getOneStakeholderRevise(
  @Param('projectId') projectId: string,
  @Param('AEInternalAssessor') AEInternalAssessor: string
  ) {
    return await this.rocAssetControlService.getOneStakeholderRevise(projectId,AEInternalAssessor);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('getassessmntgaps/:controlNo/:deviceRef')
  async getAssessmentGaps(
  @Param("controlNo") controlNo: string,
  @Param("deviceRef") deviceRef: string,) {
    return await this.rocAssetControlService.getAssessmentGaps(controlNo,deviceRef);
  }


  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('asssessorrevise/:projectId/:AEInternalAssessor')
  async getasssessorrevise(
  @Param("projectId") projectId: string,
  @Param("AEInternalAssessor") AEInternalAssessor: string,
  
) {
    return await this.rocAssetControlService.getAsssessorRevise(projectId,AEInternalAssessor);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('asssessorrevise/:projectId/:AEInternalAssessor/:assessmentId')
  async getasssessorreviseByAssessment(
  @Param("projectId") projectId: string,
  @Param("AEInternalAssessor") AEInternalAssessor: string,
  @Param("assessmentId") assessmentId: string,
 
) {
    return await this.rocAssetControlService.getAsssessorReviseByAssessment(projectId, AEInternalAssessor, assessmentId);
  }
  
  @UseGuards(JwtAuthGuard, PermissionsGuard)
@Post('submitresolutionComment/:projectId/:controlNo/:selectedReviseQstnId')
async submitresolutionComment(
  @Param("projectId") projectId: string,
  @Param("controlNo") controlNo: string,
  @Param("selectedReviseQstnId") selectedReviseQstnId: string,
  @Body('resolution') resolution: string

) {
  return await this.rocAssetControlService.submitresolutionComment(
    projectId,
    controlNo,
    selectedReviseQstnId,
    resolution
  );
}


@UseGuards(JwtAuthGuard, PermissionsGuard)
@Post('GenerateAIResponse')
async GenerateAIResponse(
  @Body() body: {
    projectId: string,
    controlNo: string,
    deviceRef: string,
    deviceType: string,
    requirementDesc: string,
    subRequirementDesc: string,
    controlDesc: string
  }
) {
  const { projectId, controlNo, deviceRef, deviceType, requirementDesc, subRequirementDesc, controlDesc } = body;
  return await this.rocAssetControlService.GenerateAIResponse(
    projectId,
    controlNo,
    deviceRef,
    deviceType,
    requirementDesc,
    subRequirementDesc,
    controlDesc
  );
}



}
