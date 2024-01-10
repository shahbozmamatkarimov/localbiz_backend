import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class NewPasswordDto {
  @ApiProperty({
    example: 'Admin@2303',
    description: 'The old password of the admin',
  })
  @IsNotEmpty()
  old_password: string;

  @ApiProperty({
    example: 'Admin_new@2303',
    description: 'The new strong password of the admin',
  })
  @IsNotEmpty()
  @IsStrongPassword()
  new_password: string;
}
