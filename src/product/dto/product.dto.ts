import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class ProductDto {
  @ApiProperty({
    example: 'Business',
    description: 'Title of product',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: "Uzbekistan",
    description: 'Location of product',
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    example: [
      'Monday - Friday: 9:00 a.m to 9.00 p.m',
      'Saturday & Sunday: 9:00 a.m to 6.00 p.m',
    ],
    description: 'Open time of product',
  })
  @IsNotEmpty()
  @IsArray()
  open_time: Array<string>;

  @ApiProperty({
    example: '+1 365 888 4444',
    description: 'Phone number of product',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'https://www.google.com/maps',
    description: 'Direction link of product',
  })
  @IsNotEmpty()
  @IsUrl()
  direction: string;

  @ApiProperty({
    example: 1,
    description: 'Category id of product',
  })
  @IsNotEmpty()
  @IsNumber()
  category_id: number;
}
