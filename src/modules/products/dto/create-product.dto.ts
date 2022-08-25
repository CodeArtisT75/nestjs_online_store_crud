import { IsDecimal, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsInt()
  quantity: number;

  @IsDecimal()
  price: number;
}
