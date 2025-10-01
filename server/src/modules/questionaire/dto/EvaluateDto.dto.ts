import { IsMongoId, IsObject, IsOptional, IsString } from "class-validator";

export class EvaluateDto {
  @IsString()
  questionnaireId: string;

  @IsObject()
  responses: Record<string, any>;

  @IsString()
  currentQuestionId: string;

  @IsString()
  @IsOptional()
  assesmentId?: string;

  @IsString()
  @IsOptional()
  projectId?: string;


}