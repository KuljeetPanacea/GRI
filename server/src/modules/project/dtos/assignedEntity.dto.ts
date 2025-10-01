import { IsNotEmpty, IsString } from "class-validator";

export class assignedEntity {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
