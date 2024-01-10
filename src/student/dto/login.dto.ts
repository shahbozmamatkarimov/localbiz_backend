import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: '+998991422303',
    description: 'Phone number of the student',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'student2303',
    description: 'The password of the student',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;
}
