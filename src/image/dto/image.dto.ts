import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ImageDto {
  @ApiProperty({
    example: '1',
    description: 'Id of the product',
  })
  @IsNotEmpty()
  product_id: number;

  @ApiProperty({
    example: 'flyer',
    description: 'Type of the image',
  })
  @IsNotEmpty()
  @IsString()
  type: string;
}
