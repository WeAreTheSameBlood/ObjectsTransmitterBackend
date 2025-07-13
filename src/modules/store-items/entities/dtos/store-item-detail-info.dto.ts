import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StoreItemDetailsInfoDTO {
  @ApiProperty({
    example: '09cc1224-7c17-438b-96ef-f19d40c30cf1',
    description: 'Unique identificator of the store item',
  })
  id: string;

  @ApiProperty({
    example: 'Bean Can x Tomate Souce',
    description: 'Title of the store item',
  })
  title: string;

  @ApiProperty({
    example: ['Tools', 'Other'],
    description: 'Categories of the store item',
    type: [String],
  })
  categories: string[];

  @ApiProperty({
    example: 'https://some-backet-uri.com/storage/buckets/.../download',
    description: 'URL to download the model file',
  })
  model_file_download_url: string;

  @ApiProperty({
    example: 'https://some-backet-uri.com/storage/buckets/.../download',
    description: 'URL to download the title image',
  })
  title_image_download_url: string;

  @ApiProperty({
    example: 3.14,
    description: 'Price od 3D model ($)',
  })
  price: number;

  @ApiProperty({
    example: 'Fri May 09 2025',
    description: 'Date string when the item was created',
  })
  date_created: string;

  @ApiProperty({
    description: 'Media files URLs as string array',
  })
  media_files_url_keys: string[];
}