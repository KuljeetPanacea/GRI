import { IsOptional, IsString } from 'class-validator';

export class PaymentChannelsDTO {
  @IsOptional() @IsString() cardPresent?: string;
  @IsOptional() @IsString() moto?: string;
  @IsOptional() @IsString() ecommerce?: string;
}

export class BusinessOverviewDataDTO {
  @IsOptional() @IsString() businessNatureDescription?: string;
  @IsOptional() @IsString() accountDataHandlingDescription?: string;
  @IsOptional() @IsString() securityImpactingServices?: string;
  @IsOptional() paymentChannels?: PaymentChannelsDTO;
  @IsOptional() @IsString() otherDetails?: string;
}