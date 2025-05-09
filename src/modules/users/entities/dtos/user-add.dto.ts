import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserAddDTO {
  @ApiProperty({
    example: 'designer_38',
    description: 'Unique username for the user',
  })
  @IsString()
  username: string;

  @ApiPropertyOptional({
    example: 'Michael Jackson',
    description: 'Optional full name of the user',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
