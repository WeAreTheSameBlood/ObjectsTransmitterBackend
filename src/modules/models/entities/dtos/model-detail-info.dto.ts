import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { UserGeneralInfoDTO } from '@src/modules/users/entities/dtos';

export class ModelDetailsInfoDTO {
  @ApiProperty({
    example: '09cc1224-7c17-438b-96ef-f19d40c30cf1',
    description: 'Unique identifier of the model',
  })
  id: string;

  @ApiProperty({
    example: 'My_Perfect_3D_model',
    description: 'Name of the model',
  })
  name: string;

  @ApiProperty({
    example: 5.8467,
    description: 'Size of the model, float value in megabytes',
  })
  size: number;

  @ApiProperty({
    example: 'Mb',
    default: 'Mb',
    description: 'Unit of measurement for size',
  })
  size_type: string;

  @ApiProperty({
    example: "Fri May 09 2025",
    description: 'Date string when the model was created',
  })
  date_created: string;

  @ApiPropertyOptional({
    type: () => UserGeneralInfoDTO,
    description: 'Owner information if available',
  })
  @IsOptional()
  owner?: UserGeneralInfoDTO;

  @ApiProperty({
    example: 'https://some-backet-uri.com/storage/buckets/.../download',
    description: 'URL to download the model file',
  })
  download_url: string;
}