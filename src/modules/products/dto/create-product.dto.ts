import { IsDecimal, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsInt()
  quantity: number;

  @ApiProperty()
  @IsDecimal()
  price: number;
}
