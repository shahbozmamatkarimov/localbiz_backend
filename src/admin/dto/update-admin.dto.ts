import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdminDto {
  @ApiProperty({
    example: '+998991422303',
    description: 'A new phone number of the admin',
  })
  phone?: string;

  @ApiProperty({
    example: 'admin',
    description: 'A new username of the admin',
  })
  username?: string;
}
