import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDetailedInfoDTO {
  @ApiProperty({
    example: '8f1bac58-3ea8-4e74-ae97-bbe43bd1fa8c',
    description: 'Unique identifier of the user',
  })
  id: string;

  @ApiProperty({
    example: 'designer_38',
    description: 'Unique username of the user',
  })
  username: string;

  @ApiPropertyOptional({
    example: 'Michael Jackson',
    description: 'Full name of the user, if provided',
  })
  name?: string;

  @ApiProperty({
    example: 'Fri May 09 2025',
    description: 'Date and time when the user registered',
  })
  date_registration: Date;

  @ApiProperty({
    example: 3,
    description: 'Number of models the user has uploaded',
  })
  added_models_count: number;

  @ApiProperty({
    example: 6,
    description: 'Number of models the user has marked as favorite',
  })
  favorite_models_count: number;
}