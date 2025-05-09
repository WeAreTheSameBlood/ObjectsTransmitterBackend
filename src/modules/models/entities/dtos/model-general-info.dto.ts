import { ApiProperty } from "@nestjs/swagger";

export class ModelGeneralInfoDTO {
  @ApiProperty({
    example: '09cc1224-7c17-438b-96ef-f19d40c30cf1',
    description: 'Unique identificator of the model',
  })
  id: string;

  @ApiProperty({
    example: "My_Perfect_3D_model",
    description: 'Name of the model'
  })
  name: string;

  @ApiProperty({
    example: 5.8467,
    description: 'Size of the model, float value',
  })
  size: number;

  @ApiProperty({
    example: "Mb",
    default: "Mb",
    description: 'Unit of measurement of size'
  })
  size_type: string;
}