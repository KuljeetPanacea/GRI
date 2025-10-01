import { IsString, IsOptional } from "class-validator";

export class ProjectResponseDTO {
  @IsString()
  message: string;

  @IsString()
  projectId: string;
}

export class ProjectUpdateResponseDTO {
  @IsString()
  message: string;

  @IsOptional()
  data?: any;
}
