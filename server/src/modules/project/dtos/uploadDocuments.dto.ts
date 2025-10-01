import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class UploadDocumentDTO {
  file: Express.Multer.File;

  @IsNotEmpty()
  @IsString()
  documentType: string;

  @IsNotEmpty()
  @IsDefined()
  __v: number;
}
