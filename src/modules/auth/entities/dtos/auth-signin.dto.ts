import { IsEmail, IsString, MinLength, IsOptional, IsUrl } from 'class-validator';

export class AuthSingInDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  username: string;

  @IsString()
  name?: string;
}
