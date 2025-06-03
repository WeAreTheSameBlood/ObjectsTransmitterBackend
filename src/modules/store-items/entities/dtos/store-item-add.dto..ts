import { IsString, IsOptional } from "class-validator";

export class StoreItemAddDTO {
  @IsString()
  title: string;

  @IsString()
  brand: string;

  @IsOptional()
  @IsString()
  barcode_value?: string;

  @IsString()
  amount: string;
}