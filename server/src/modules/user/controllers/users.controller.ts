import { Controller, Post, Get, Param, Body, UseGuards, Patch, Delete, Query, Req } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { UserDTO } from "../dtos/User.dto";
import { PermissionsGuard } from "src/core/guards/permissions.guards";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { UpdateUserDto } from "../dtos/updateUser.dto";
import { LookupResponseDto } from "../dtos/lookup.dto";
import { Permissions } from "src/core/guards/permissions.guards";
import { AddUserDTO } from "../dtos/addUser.dto";
import { QueryOptions } from "src/core/database/query-options.interface";
import { separateQueryOptions } from "src/utils/util";
import { ResponseUserDTO } from "../dtos/reponseUser.dto";
@Controller("users") // This sets the base route for the controller
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get("test")
  async testing(): Promise<String> {
    return "This is to test the server";
  }
  
  @Get("by-id/:id")
  async getUser(@Param("id") id: string): Promise<String> {
    return await this.userService.findUsernameById(id);
  }

  // Endpoint to find a user by email
  @Get("email/:email")
  async getUserByEmail(@Param("email") email: string): Promise<UserDTO> {
    return await this.userService.findUserByEmail(email);
  }

  @Permissions("UserManagement")
  @Post("createuser")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async createUser(@Body() userDto: UserDTO): Promise<AddUserDTO> {
    return await this.userService.createUser(userDto);
  }

  @Permissions("UserManagement")
  @Patch("updateuser/:id")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async updateUser(
    @Param("id") id: string, 
    @Body() userDto: UpdateUserDto
  ): Promise<{message:string}> {
    return await this.userService.updateUser(id, userDto);
  }

  @Permissions("UserManagement")
  @Delete("deleteuser/:id")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async deleteUser(
    @Param("id") id: string
  ): Promise<{ success: boolean; message: string }> {
    return await this.userService.deleteUser(id);
  }

  @Permissions("UserManagement")
  @Get("search")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
 @Get('users')
async allUser(
  @Query() query: Partial<QueryOptions>,
  @Req() req: any
): Promise<{
  users: ResponseUserDTO[];
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
}> {
  const { options, filter } = separateQueryOptions(query);
  return await this.userService.allUser(filter, options, req.user);
}

  @Permissions("UserManagement")
  @Get("lookup")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async lookUp(): Promise<LookupResponseDto> {
    return await this.userService.lookUp();
  }

  @Permissions("UserManagement")
  @Get("roles/:rolename")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async getUserByRole(@Param("rolename") rolename: string): Promise<UserDTO[]> {
    return await this.userService.getuserByroleName(rolename);
  }

  @Post("updatePasswordAEPoc/:id")
  async updatePasswordAEPoC(@Param("id") id: string, 
  @Body() password: string){
    return await this.userService.updatePassword(id, password);
  }

  @Post("createproductadmin")
  async createProductAdmin(@Body() userDto: UserDTO): Promise<UserDTO>{
    return await this.userService.createProductAdmin(userDto);
  }
}
