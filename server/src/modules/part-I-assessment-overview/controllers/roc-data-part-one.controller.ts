import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { PermissionsGuard } from "src/core/guards/permissions.guards";
import { Permissions } from "src/core/guards/permissions.guards";
import { RocDataPartOneService } from "../service/roc-data-part-one.service";
import { RocDataPartOneDTO } from "../dtos/roc-data-part-one.dto";
import { ContactInfoDataDTO } from "../dtos/contact-info-data.dto";
import { BusinessOverviewDataDTO } from "../dtos/business-overview-data.dto";
import { ScopeOfWorkDataDTO } from "../dtos/scope-of-work-data.dto";
import { ReviewedEnvDataDTO } from "../dtos/reviewed-env-data.dto";
import { QuarterlyScanFormDataDTO } from "../dtos/quarterly-scan-form-data.dto";

@Controller("roc-part-one")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RocDataPartOneController {
  constructor(private readonly rocService: RocDataPartOneService) {}
  @Permissions("MyProjects")
  @Post("create")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async createRocDataPartOne(@Body() dto: RocDataPartOneDTO) {
    return await this.rocService.createRocDataPartOne(dto);
  }

  // @Permissions("MyProjects")
  @Permissions("MyProjects")
  @Post("contact-info")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async upsertContactInfo(@Body() dto: RocDataPartOneDTO) {
    return await this.rocService.createContactInfo(dto);
  }

  @Permissions("MyProjects")
  @Post("business-overview")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async upsertBusinessOverview(@Body() dto: RocDataPartOneDTO) {
    return await this.rocService.createBusinessOverview(dto);
  }

  @Permissions("MyProjects")
  @Post("scope-of-work")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async upsertScopeOfWork(@Body() dto: RocDataPartOneDTO) {
    return await this.rocService.createScopeOfWork(dto);
  }

  @Permissions("MyProjects")
  @Post("reviewed-environment")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async upsertReviewedEnv(@Body() dto: RocDataPartOneDTO) {
    return await this.rocService.createReviewedEnv(dto);
  }

  @Permissions("MyProjects")
  @Post("quarterly-scan-form")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async upsertQuarterlyScanForm(@Body() dto: RocDataPartOneDTO) {
    return await this.rocService.createQuarterlyScanForm(dto);
  }

  @Permissions("MyProjects")
  @Get(":projectId")

  async getRocDataByProjectId(@Param("projectId") projectId: string) {
    return await this.rocService.getByProjectId(projectId);
  }

  @Permissions("MyProjects")
  @Get(":type/:projectId")
  async getRocContactInfo(@Param("projectId") projectId: string, @Param("type") type: string) {
    return await this.rocService.getTypeInfo(type, projectId);
  }

  @Permissions("MyProjects")
  @Patch(":projectId/contact-info")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async updateContactInfo(
    @Param("projectId") projectId: string,
    @Body() dto: ContactInfoDataDTO
  ) {
    return await this.rocService.updateContactInfo(projectId, dto);
  }

  @Permissions("MyProjects")
  @Patch(":projectId/business-overview")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async updateBusinessOverview(
    @Param("projectId") projectId: string,
    @Body() dto: BusinessOverviewDataDTO
  ) {
    return await this.rocService.updateBusinessOverview(projectId, dto);
  }

  @Permissions("MyProjects")
  @Patch(":projectId/scope-of-work")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async updateScopeOfWork(
    @Param("projectId") projectId: string,
    @Body() dto: ScopeOfWorkDataDTO
  ) {
    return await this.rocService.updateScopeOfWork(projectId, dto);
  }

   @Permissions("MyProjects")
  @Patch(":projectId/reviewed-env")
  async updateReviewedEnv(
    @Param("projectId") projectId: string,
    @Body() dto: ReviewedEnvDataDTO
  ) {
    return await this.rocService.updateReviewedEnv(projectId, dto);
  }

  @Permissions("MyProjects")
  @Patch(":projectId/quarterly-scan")
  async updateQuarterlyScanForm(
    @Param("projectId") projectId: string,
    @Body() dto: QuarterlyScanFormDataDTO
  ) {
    return await this.rocService.updateQuarterlyScanForm(projectId, dto);
  }
}
