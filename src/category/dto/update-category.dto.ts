import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Business',
    description: 'Title of category',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Businesses category',
    description: 'Description of category',
  })
  @IsOptional()
  @IsString()
  description: string;
}
