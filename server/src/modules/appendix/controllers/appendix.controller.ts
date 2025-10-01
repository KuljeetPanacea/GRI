import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { PermissionsGuard } from "src/core/guards/permissions.guards";
import { AppendixService } from "../service/appendix.service";
import { AppendixADTO, AppendixAResponseDto } from "../dtos/appendix-a.dto";
import { AppendixCDTO, AppendixCResponseDto } from "../dtos/appendix-c.dto";
import { AppendixEDTO, AppendixEResponseDto } from "../dtos/appendix-e.dto";

@Controller("appendix")
export class AppendixController {
  constructor(private readonly appendixService: AppendixService) {}

  // CREATE OPERATIONS
  @Post("upsert-a")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async upsertAppendixA(@Body() dto: AppendixADTO) {
    return await this.appendixService.upsertAppendixA(dto);
  }

  @Post("upsert-c")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async upsertAppendixC(
    @Body() appendixData: AppendixCDTO
  ): Promise<{ message: string; appendix: AppendixCResponseDto }> {
    return await this.appendixService.upsertAppendixC(appendixData);
  }

  @Post("upsert-e")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async upsertAppendixE(
    @Body() appendixData: AppendixEDTO
  ): Promise<{ message: string; appendix: AppendixEResponseDto }> {
    return await this.appendixService.upsertAppendixE(appendixData);
  }

  @Patch("update-appendix-c/:id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async updateAppendixC(
    @Param("id") id: string,
    @Body() appendixData: AppendixCDTO
  ): Promise<{ message: string; appendix: AppendixCResponseDto }> {
    return await this.appendixService.updateAppendixC(id, appendixData);
  }

  @Patch("update-appendix-e/:id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async updateAppendixE(
    @Param("id") id: string,
    @Body() appendixData: AppendixEDTO
  ): Promise<{ message: string; appendix: AppendixEResponseDto }> {
    return await this.appendixService.updateAppendixE(id, appendixData);
  }

  // READ OPERATIONS
  @Get("get-appendix/:id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async getAppendixById(
    @Param("id") id: string
  ): Promise<
    AppendixAResponseDto | AppendixCResponseDto | AppendixEResponseDto
  > {
    return await this.appendixService.getAppendixById(id);
  }

  @Get("get-appendix-by-type/:projectId/:appendixType")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async getAppendixByProjectIdAndType(
    @Param("projectId") projectId: string,
    @Param("appendixType") appendixType: string
  ): Promise<
    AppendixAResponseDto | AppendixCResponseDto | AppendixEResponseDto | null
  > {
    return await this.appendixService.getAppendixByProjectIdAndType(
      projectId,
      appendixType
    );
  }

  @Get(":projectId/:appendixType/control/:title")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async getAppendixControlByTitle(
    @Param("projectId") projectId: string,
    @Param("appendixType") appendixType: string,
    @Param("title") controlTitle: string
  ) {
    return await this.appendixService.getControlByTitle(
      projectId,
      appendixType,
      controlTitle
    );
  }

  // DELETE OPERATION
  @Delete("delete-appendix/:id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async deleteAppendix(@Param("id") id: string): Promise<{ message: string }> {
    return await this.appendixService.deleteAppendix(id);
  }
}
