import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './models/admin.models';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { LoginAdminDto } from './dto/login-admin.dto';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { generateToken, writeToCookie } from 'src/utils/token';
import { NewPasswordDto } from './dto/new-password.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin) private adminRepository: typeof Admin,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerAdminDto: RegisterAdminDto,
    res: Response,
  ): Promise<object> {
    try {
      if (process.env.ADMIN_SECRET_KEY != registerAdminDto.secret_key) {
        throw new ForbiddenException('The secret key is not valid!');
      }
      const hashed_password = await hash(registerAdminDto.password, 7);
      const admin = await this.adminRepository.create({
        ...registerAdminDto,
        hashed_password,
      });
      const { access_token, refresh_token } = await generateToken(
        { id: admin.id },
        this.jwtService,
      );
      await writeToCookie(refresh_token, res);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Registered successfully',
        data: {
          admin,
        },
        token: access_token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginAdminDto: LoginAdminDto, res: Response): Promise<object> {
    try {
      const { phone, password } = loginAdminDto;
      const admin = await this.adminRepository.findOne({ where: { phone } });
      if (!admin) {
        throw new NotFoundException('The phone not found!');
      }
      const is_match_pass = await compare(password, admin.hashed_password);
      if (!is_match_pass) {
        throw new ForbiddenException('The password is not valid!');
      }

      const { access_token, refresh_token } = await generateToken(
        { id: admin.id },
        this.jwtService,
      );
      await writeToCookie(refresh_token, res);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Registered successfully',
        data: {
          admin,
        },
        token: access_token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async logout(refresh_token: string, res: Response): Promise<object> {
    try {
      const data = await this.jwtService.verify(refresh_token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
      const admin = await this.getById(data.id);
      res.clearCookie('refresh_token');
      return {
        statusCode: HttpStatus.OK,
        mesage: 'Logged out successfully',
        data: {
          admin,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: string): Promise<object> {
    try {
      const admin = await this.adminRepository.findByPk(id);
      if (!admin) {
        throw new NotFoundException('The admin not found!');
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          admin,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(page: number, limit: number): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const admins = await this.adminRepository.findAll({ offset, limit });
      const total_count = await this.adminRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: admins,
          pagination: {
            currentPage: Number(page),
            total_pages,
            total_count,
          },
        },
      };
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async newPassword(
    id: string,
    newPasswordDto: NewPasswordDto,
  ): Promise<object> {
    try {
      const { old_password, new_password } =
        newPasswordDto;
      const admin = await this.adminRepository.findByPk(id);
      if (!admin) {
        throw new NotFoundException('Admin not found!');
      }
      const is_match_pass = await compare(old_password, admin.hashed_password);
      if (!is_match_pass) {
        throw new ForbiddenException('The old password is not valid!');
      }
      const hashed_password = await hash(new_password, 7);
      const updated_info = await this.adminRepository.update(
        { hashed_password },
        { where: { id }, returning: true },
      );
      return {
        statusCode: HttpStatus.OK,
        message: "Password updated successfully",
        data: {
          admin: updated_info[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateProfile(
    id: string,
    updateAdminDto: UpdateAdminDto,
  ): Promise<object> {
    try {
      const admin = await this.adminRepository.findByPk(id);
      if (!admin) {
        throw new NotFoundException('Admin topilmadi!');
      }
      const { phone, username } = updateAdminDto;
      let dto = {};
      if (!phone) {
        dto = Object.assign(dto, { phone: admin.phone });
      }
      if (!username) {
        dto = Object.assign(dto, { username: admin.username });
      }
      const obj = Object.assign(updateAdminDto, dto);
      const update = await this.adminRepository.update(obj, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: "Updated successfully",
        data: {
          admin: update[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteAdmin(id: string): Promise<object> {
    try {
      const admin = await this.adminRepository.findByPk(id);
      if (!admin) {
        throw new NotFoundException('Admin not foud!');
      }
      admin.destroy();
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: "Deleted successfully",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
