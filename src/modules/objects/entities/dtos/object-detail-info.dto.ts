import { UserGeneralInfoDTO } from "@src/modules/users/entities/dtos";
import { IsOptional } from 'class-validator';

export class ObjectDetailsInfoDTO {
  id: string;
  name: string;
  size: number;
  size_type: string;
  date_created: string;
  
  @IsOptional()
  owner?: UserGeneralInfoDTO;
  download_url: string;
}