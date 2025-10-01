import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ClientService } from "../services/client.service";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { PermissionsGuard } from "src/core/guards/permissions.guards";
import { Permissions } from "src/core/guards/permissions.guards";
import { ClientDTO } from "../dto/client.dto";
import { UpdateClientDTO } from "../dto/updateClient.dto";
import { QueryOptions } from "src/core/database/query-options.interface";

@Controller("client") // This sets the base route for the controller
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Permissions("ClientManagement")
  @Post("createclient")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async createClient(@Body() clientDTO: ClientDTO): Promise<{message: string, success: boolean}> {
    return await this.clientService.createClient(clientDTO);
      
  }

  @Permissions("ClientManagement")
  @Patch("updateclient/:id")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async updateClient(
    @Param("id") id: string, 
    @Body() userDto: UpdateClientDTO
  ): Promise<{message: string, success: boolean}> {
    
    return await this.clientService.updateClient(id, userDto);
  }

  @Permissions("ClientManagement")
  @Delete("deleteclient/:id")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async deleteClient(
    @Param("id") id: string
  ): Promise<{ success: boolean; message: string }> {
    return await this.clientService.deleteClient(id);
  }

  @Permissions("ClientManagement")
  @Get("all-client")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async allClient(@Query() query: Partial<QueryOptions>): Promise<{
    clients: ClientDTO[];
    currentPage?: number;
    totalPages?: number;
    totalCount?: number;
  }>{
    return await this.clientService.allClient(query);
  }

  @Permissions("ClientManagement") 
  @Get("assessed-entity/:clientId")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async getAssessedEntity(@Param("clientId") clientId: string) {
    const clientData = await this.clientService.getAssessedEntity(clientId);
  
    return [clientData.auditEntity];
  }


}