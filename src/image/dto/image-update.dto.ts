import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ImageUpdateDto {
  @ApiProperty({
    example: 'Rose 4k',
    description: 'Name of the image',
  })
  name?: string;

  @ApiProperty({
    example: '1 mb',
    description: 'Size of the image',
  })
  size?: string;

  @ApiProperty({
    example: '1',
    description: 'ID of the product',
  })
  @IsNotEmpty()
  @IsNumber()
  product_id?: number;
}
