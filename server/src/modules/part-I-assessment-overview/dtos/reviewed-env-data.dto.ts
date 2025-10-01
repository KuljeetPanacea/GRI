import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class AccountFlowDTO {
  @IsOptional()
  @IsString()
  flow?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class AccountFlowOptionsDTO {
  @IsBoolean()
  authorization: boolean;

  @IsBoolean()
  capture: boolean;

  @IsBoolean()
  settlement: boolean;

  @IsBoolean()
  chargebackDispute: boolean;

  @IsBoolean()
  refunds: boolean;

  @IsBoolean()
  other: boolean;
}

export class DataStorageDTO {
  @IsOptional()
  @IsString()
  dataStore?: string;

  @IsOptional()
  @IsString()
  fileTableField?: string;

  @IsOptional()
  @IsString()
  storedElements?: string;

  @IsOptional()
  @IsString()
  securityMethod?: string;

  @IsOptional()
  @IsString()
  loggingDescription?: string;
}

export class ServiceProviderDTO {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  accountDataImpact?: string;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsBoolean()
  assessedYes: boolean;

  @IsBoolean()
  assessedNo: boolean;

  @IsOptional()
  @IsString()
  aocDate?: string;

  @IsOptional()
  @IsString()
  aocVersion?: string;

  @IsBoolean()
  includedInAssessmentYes: boolean;

  @IsBoolean()
  includedInAssessmentNo: boolean;
}

export class NetworkDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  purpose?: string;
}

export class FacilityDTO {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  count?: string;

  @IsOptional()
  @IsString()
  location?: string;
}

export class SystemComponentDTO {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  count?: string;

  @IsOptional()
  @IsString()
  vendor?: string;

  @IsOptional()
  @IsString()
  product?: string;

  @IsOptional()
  @IsString()
  role?: string;
}

export class ReviewedEnvDataDTO {
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  networkDiagrams?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  dataFlowDiagrams?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AccountFlowDTO)
  accountFlows: AccountFlowDTO[];

  @ValidateNested()
  @Type(() => AccountFlowOptionsDTO)
  accountFlowOptions: AccountFlowOptionsDTO;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataStorageDTO)
  dataStorage: DataStorageDTO[];

  @IsBoolean()
  sadStoredPostAuth_Yes: boolean;

  @IsBoolean()
  sadStoredPostAuth_No: boolean;

  @IsBoolean()
  sadStoredAsIssuer_Yes: boolean;

  @IsBoolean()
  sadStoredAsIssuer_No: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceProviderDTO)
  serviceProviders: ServiceProviderDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NetworkDTO)
  inScopeNetworks: NetworkDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NetworkDTO)
  connectedNonCDENetworks: NetworkDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FacilityDTO)
  facilities: FacilityDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SystemComponentDTO)
  systemComponents: SystemComponentDTO[];
}
