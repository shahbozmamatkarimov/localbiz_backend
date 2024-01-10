import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class UpdateDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the student',
  })
  @IsString()
  full_name?: string;
  
  @ApiProperty({
    example: 'true',
    description: 'Is_study of the student',
  })
  @IsBoolean()
  is_study?: boolean;
}
