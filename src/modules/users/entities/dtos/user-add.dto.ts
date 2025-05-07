import { IsString, IsOptional } from 'class-validator';

export class UserAddDTO {
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  name?: string;
}
