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
    example: 'Bean & Co.',
    description: 'Brand of the store item',
  })
  brand: string;

  @ApiProperty({
    example: 14,
    description: 'Total amount, int value',
  })
  amount: number;
}