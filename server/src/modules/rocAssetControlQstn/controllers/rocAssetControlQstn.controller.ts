import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { PermissionsGuard } from "src/core/guards/permissions.guards";
import { RocAssetControlQstnService } from "../service/rocAssetControlQstn.service";
import { RocAssetControlQstnDTO } from "../dtos/rocAssetControlQstn.dto";

@Controller("rocAssetControlQstn")
export class RocAssetControlQstnController {
  constructor(private readonly rocAssetControlQstnService: RocAssetControlQstnService) {}

  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Post("RocAssetControl-create")
  async createRocAssetControl(@Body() dto: RocAssetControlQstnDTO): Promise<RocAssetControlQstnDTO> {
    return await this.rocAssetControlQstnService.create(dto);
  }


  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Get("rocAssetControlget/:projectId/:controlNo/:deviceRef")
  async getRocQuestions( @Param('projectId') projectId: string,
  @Param('controlNo') controlNo: string, 
  @Param('deviceRef') deviceRef: string
): Promise<RocAssetControlQstnDTO[]> {
    return await this.rocAssetControlQstnService.getQuestions(projectId,controlNo,deviceRef);
  }


  


}