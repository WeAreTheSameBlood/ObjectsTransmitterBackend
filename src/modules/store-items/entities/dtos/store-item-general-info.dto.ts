import { ApiProperty } from "@nestjs/swagger";

export class StoreItemGeneralInfoDTO {
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
    example: ['Tools', 'Other'],
    description: 'Categories of the store item',
    type: [String],
  })
  categories: string[];
}