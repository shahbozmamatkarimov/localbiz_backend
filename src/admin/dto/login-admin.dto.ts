import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({
    example: '+998991422303',
    description: 'Phone number of admin',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'Admin@2303',
    description: 'The strong password of the admin',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
