import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { BaseDTO } from "src/core/dto/base-dto";
import { ContactInfoDataDTO } from "./contact-info-data.dto";
import { BusinessOverviewDataDTO } from "./business-overview-data.dto";
import { ScopeOfWorkDataDTO } from "./scope-of-work-data.dto";
import { ReviewedEnvDataDTO } from "./reviewed-env-data.dto";
import { QuarterlyScanFormDataDTO } from "./quarterly-scan-form-data.dto";

export class RocDataPartOneDTO extends BaseDTO {
  @IsString()
  id: string;

  @ValidateNested()
  @Type(() => ContactInfoDataDTO)
  contactInfoData: ContactInfoDataDTO;

  @ValidateNested()
  @Type(() => BusinessOverviewDataDTO)
  businessOverviewData: BusinessOverviewDataDTO;

  @ValidateNested()
  @Type(() => ScopeOfWorkDataDTO)
  scopeOfWorkData: ScopeOfWorkDataDTO;

  @ValidateNested()
  @Type(() => ReviewedEnvDataDTO)
  reviewedEnvData: ReviewedEnvDataDTO;

  @ValidateNested()
  @Type(() => QuarterlyScanFormDataDTO)
  quarterlyScanFormData: QuarterlyScanFormDataDTO;

  @IsString()
  projectId: string;
  
}
