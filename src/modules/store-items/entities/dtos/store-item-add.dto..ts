import { IsArray, IsEnum, IsString } from 'class-validator';
import { ItemCategory } from "../domain/item-categories";
import { Transform } from 'class-transformer';

export class StoreItemAddDTO {
  @IsString()
  title: string;

  @IsString()
  brand: string;

  @IsString()
  barcode_value: string;

  @IsString()
  price: string;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value.split(',').map((v: string) => v.trim());
      }
    }
    return value;
  }, { toClassOnly: true })
  @IsArray()
  @IsEnum(ItemCategory, { each: true })
  categories: ItemCategory[];
}