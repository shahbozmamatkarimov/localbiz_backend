import { newPasswordDto } from './dto/newPassword.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Res,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { Response } from 'express';
import { CookieGetter } from 'src/decorators/cookieGetter.decorator';
import { StudentService } from './student.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateDto } from './dto/update.dto';
import { UpdatePhoneDto } from './dto/updatePhone.dto';

@ApiTags('Student')
@Controller('student')

export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @ApiOperation({ summary: 'Register' })
  @Post('register')
  register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.studentService.register(registerDto, res);
  }

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.studentService.login(loginDto, res);
  }

  @ApiOperation({ summary: 'Logout' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  logout(
    @CookieGetter('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.studentService.logout(refresh_token, res);
  }

  @ApiOperation({ summary: 'Get students by pagination' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('pagination/:page/:limit')
  getAll(@Param('page') page: number, @Param('limit') limit: number) {
    return this.studentService.getAll(page, limit);
  }

  @ApiOperation({ summary: 'Get student by ID' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.studentService.getById(id);
  }

  @ApiOperation({ summary: 'Update profile with full_name and is_study' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDto,
  ) {
    return this.studentService.update(id, updateDto);
  }

  @ApiOperation({ summary: 'Update phone number' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put('/update_phone/:id')
  updatePhone(
    @Param('id') id: string,
    @Body() updatePhoneDto: UpdatePhoneDto,
  ) {
    return this.studentService.updatePhone(id, updatePhoneDto);
  }

  @ApiOperation({ summary: 'New password' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put('/new_password/:id')
  newPassword(
    @Param('id') id: string,
    @Body() newPasswordDto: newPasswordDto,
  ) {
    return this.studentService.newPassword(id, newPasswordDto);
  }

  @ApiOperation({ summary: 'Delete student by ID' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  deleteClient(@Param('id') id: string) {
    return this.studentService.delete(id);
  }
}
