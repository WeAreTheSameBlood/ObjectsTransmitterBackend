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
    example: 'Bean & Co.',
    description: 'Brand of the store item',
  })
  brand: string;

  @ApiProperty({
    example: '1 2345 678 9123 4',
    description: '(Optional) Barcode value',
    nullable: true,
  })
  barcode_value: string;

  @ApiProperty({
    example: 'https://some-backet-uri.com/storage/buckets/.../download',
    description: 'URL to download the barcode image',
  })
  barcode_download_url: string;

  @ApiProperty({
    example: 'https://some-backet-uri.com/storage/buckets/.../download',
    description: 'URL to download the model file',
  })
  model_file_download_url: string;

  @ApiProperty({
    example: 14,
    description: 'Total amount, int value',
  })
  amount: number;

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