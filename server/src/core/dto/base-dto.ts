// core/database/base.dto.ts
import { IsOptional } from "class-validator";

export class BaseDTO {
  @IsOptional()
  id?: string;

  @IsOptional()
  createdBy?: string;
  
  @IsOptional()
  updatedBy?: string;

  @IsOptional()
  createDtTime?: Date;

  @IsOptional()
  updateDtTime?: Date;

  @IsOptional()
  __v?: number;

  @IsOptional()
  _id?: object;
}
