import { ApiProperty } from '@nestjs/swagger';

export class UserGeneralInfoDTO {
  @ApiProperty({
    example: '8f1bac58-3ea8-4e74-ae97-bbe43bd1fa8c',
    description: 'Unique identifier of the user',
  })
  id: string;

  @ApiProperty({
    example: 'designer_38',
    description: 'Unique username chosen by the user',
  })
  username: string;

  @ApiProperty({
    example: 'Fri May 09 2025',
    description: 'String of the user registration date',
  })
  date_registration: string;

  @ApiProperty({
    example: 3,
    description: 'Number of models the user has uploaded',
  })
  added_models_count: number;
}
