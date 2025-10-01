import { IsBoolean, IsString } from "class-validator";
import { BaseDTO } from "src/core/dto/base-dto";
import { UserDTO } from "./User.dto";

export class AddUserDTO extends BaseDTO {
   
  data:UserDTO

  @IsBoolean()
  success:boolean;

  @IsString()
  message: string;
}