import { Controller, Get, Param, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { PermissionsGuard } from "src/core/guards/permissions.guards";
import { GenerateRocService } from "../service/generateRoc.service";
import { RocDataFetcher } from "../service/rocDataFetcher";

@Controller("generate-roc")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GenerateRocController {
  constructor(
    private readonly generateRocService: GenerateRocService,
    private readonly rocDataFetcher: RocDataFetcher
  ) {}

  @Get(":projectId")
  async getFullRocData(@Param("projectId") projectId: string) {
    return await this.rocDataFetcher.fetch(projectId);
  }

  @Get("download/:projectId")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async downloadRocDocx(
    @Param("projectId") projectId: string,
    @Res() res: Response
  ) {
    const buffer = await this.generateRocService.generateRocDocument(projectId);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=roc-${projectId}.docx`
    );
    res.send(buffer);
  }
}
