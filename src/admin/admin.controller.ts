import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { Response } from 'express';
import { CookieGetter } from 'src/decorators/cookieGetter.decorator';
import { NewPasswordDto } from './dto/new-password.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Register' })
  @Post('/register')
  register(
    @Body() registerAdminDto: RegisterAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.register(registerAdminDto, res);
  }

  @ApiOperation({ summary: 'Login' })
  @Post('/login')
  login(
    @Body() loginAdminDto: LoginAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.login(loginAdminDto, res);
  }

  @ApiOperation({ summary: 'Logout' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('/logout')
  logout(
    @CookieGetter('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.logout(refresh_token, res);
  }

  @ApiOperation({ summary: 'Get admin by id' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.adminService.getById(id);
  }

  @ApiOperation({ summary: 'Get admins with pagination' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('pagination/:page/:limit')
  pagination(@Param('page') page: number, @Param('limit') limit: number) {
    return this.adminService.getAll(page, limit);
  }

  @ApiOperation({ summary: 'New password of admin' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put('new_password/:id')
  newPassword(@Param('id') id: string, @Body() newPasswordDto: NewPasswordDto) {
    return this.adminService.newPassword(id, newPasswordDto);
  }

  @ApiOperation({ summary: 'Update admin profile by id' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put('profile/:id')
  updateProfile(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminService.updateProfile(id, updateAdminDto);
  }

  @ApiOperation({ summary: 'Delete admin by id' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  deleteAdmin(@Param('id') id: string) {
    return this.adminService.deleteAdmin(id);
  }
}
