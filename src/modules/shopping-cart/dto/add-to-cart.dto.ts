import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty()
  @IsInt()
  productId: number;

  @ApiProperty()
  @IsInt()
  count: number;
}
