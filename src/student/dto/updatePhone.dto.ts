import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdatePhoneDto {
  @ApiProperty({
    example: '+998991422303',
    description: 'The old phone number of the student',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  old_phone?: string;

  @ApiProperty({
    example: '+998991422303',
    description: 'A new phone number of the student',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  new_phone?: string;

  @ApiProperty({
    example: 'student2304',
    description: 'The old password of the student',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password?: string;
}
