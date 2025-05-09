import { IsString, IsOptional } from "class-validator";

export class ModelAddDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  owner_id?: string;
}