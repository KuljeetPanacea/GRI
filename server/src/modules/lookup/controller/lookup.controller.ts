import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { PermissionsGuard } from "src/core/guards/permissions.guards";
import { LookupService } from "../service/lookup.service";
import { LookupDTO } from "../dtos/lookup.dto";
import { LookupResponseDTO } from "../dtos/lookup-response.dto";

@Controller("lookup") 
export class LookupController {
  constructor(private readonly lookupService: LookupService) {}

  @Post("createlookup")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async createProject(@Body() lookupDTO: LookupDTO): Promise<LookupResponseDTO>      {
    return await this.lookupService.createLookup(lookupDTO);
  }

  @Get("lookupcategory/:category")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async getLookupByCategory(@Param("category") category: string ): Promise< LookupDTO[]> {
    return await this.lookupService.getLookupByCategory(category)
  }
}