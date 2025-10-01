import { IsString } from "class-validator";

export class LookupResponseDTO {
  @IsString()
  message: string;

  @IsString()
  lookupId: string;
}