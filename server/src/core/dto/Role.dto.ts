import {
    IsString,
    IsArray
  } from "class-validator";
  import { BaseDTO } from "src/core/dto/base-dto";
import { MainNavMenuDTO } from "./mainNavMenu.dto";
  
  export class RoleDTO extends BaseDTO {
  
    @IsString()
    name: string;
  
    @IsArray()
    @IsString({ each: true })
    permissions: string[]; 

    @IsArray()
    mainNavMenu : MainNavMenuDTO[];

  }
  