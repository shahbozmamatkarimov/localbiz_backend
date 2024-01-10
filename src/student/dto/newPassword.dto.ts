import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class newPasswordDto {
  @ApiProperty({
    example: '+998991422303',
    description: 'Phone number of the student',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({
    example: 'student2303',
    description: 'The old password of the student',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  old_password?: string;

  @ApiProperty({
    example: 'student2303',
    description: 'A new password of the student',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  new_password?: string;
}
