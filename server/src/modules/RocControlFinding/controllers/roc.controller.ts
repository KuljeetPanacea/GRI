import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { PermissionsGuard } from "src/core/guards/permissions.guards";
import { RocControlFindingService } from "../service/rocControlFinding.service";
import { RocControlDataResponse, RocControlFindingDTO } from "../dtos/RocControlFinding.dto";

@Controller("rocControlFinding")
export class RocControlFindingController {
  constructor(private readonly rocService: RocControlFindingService) {}

  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Post("create-roc")
  async createRoc(@Body() dto: RocControlFindingDTO): Promise<RocControlFindingDTO> {
    return await this.rocService.create(dto);
  }

  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Patch(':id')
  async updateRoc(
    @Param('id') id: string,
    @Body() dto: Partial<RocControlFindingDTO>
  ): Promise<RocControlFindingDTO> {
    return await this.rocService.update(id, dto);
  }

  @Get("getroc/:controlNo/:assessmentId/:projectId")
  async getRoc(@Param('controlNo') controlNo: string,
  @Param('assessmentId') assessmentId: string,
  @Param('projectId') projectId: string): Promise<RocControlFindingDTO  | { message: string }> {
    const result = await this.rocService.getRoc(controlNo, assessmentId, projectId);
    return result;
  }

  @Get("getcontrolData/:projectId/:controlNo")
  async getControlData(@Param('controlNo') controlNo: string,
  @Param('projectId') projectId: string): Promise<RocControlDataResponse> {
    const result = await this.rocService.getControlData(projectId, controlNo);
    return result;
  }
  
}