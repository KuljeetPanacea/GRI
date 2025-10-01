import { IsString } from "class-validator";
 
export class MainNavMenuDTO  {
  @IsString()
  id: string;
 
  @IsString()
  path: string;
 
  @IsString()
  icon: string;
 
  @IsString()
  label: string;
 
  @IsString()
  tooltip: string;
}