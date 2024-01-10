import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterAdminDto {
  @ApiProperty({
    example: 'mytest_admin',
    description: 'The username of the admin',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: '+998991422303',
    description: 'The phone number of the admin (not required)',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'Admin@2303',
    description: 'The strong password of the admin',
  })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: 'adminSecretKey',
    description: 'The secret key of the admin',
  })
  @IsNotEmpty()
  @IsString()
  secret_key: string;
}
