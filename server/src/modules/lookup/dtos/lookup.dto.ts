import {
    IsString,
    IsArray,
    IsOptional,
  } from "class-validator";
import { BaseDTO } from "src/core/dto/base-dto";
import { LookupValue } from "../model/lookup.model";
  
export class LookupDTO extends BaseDTO  {

@IsOptional()
@IsString()
lookUpId?: string;

@IsString()
category?: string;

@IsArray()
values: LookupValue[];


}
  