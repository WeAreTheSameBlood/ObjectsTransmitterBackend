import { IsString, IsOptional } from "class-validator";

export class ObjectsAddDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  owner_id?: string;
}