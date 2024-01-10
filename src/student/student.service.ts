import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { generateToken, writeToCookie } from 'src/utils/token';
import { Student } from './models/student.model';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateDto } from './dto/update.dto';
import { newPasswordDto } from './dto/newPassword.dto';
import { UpdatePhoneDto } from './dto/updatePhone.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student) private studentRepository: typeof Student,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto, res: Response): Promise<object> {
    try {
      const hashed_password = await hash(registerDto.password, 7);
      const student = await this.studentRepository.create({
        ...registerDto,
        hashed_password,
      });
      const { access_token, refresh_token } = await generateToken(
        { id: student.id },
        this.jwtService,
      );
      await writeToCookie(refresh_token, res);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Registered successfully!',
        data: {
          student,
        },
        token: access_token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginDto: LoginDto, res: Response): Promise<object> {
    try {
      const { phone, password } = loginDto;
      const student = await this.studentRepository.findOne({
        where: { phone },
      });
      if (!student) {
        throw new BadRequestException('Phone number not found');
      }
      const is_match_pass = await compare(password, student.hashed_password);
      if (!is_match_pass) {
        throw new BadRequestException('The password did not valid');
      }

      const { access_token, refresh_token } = await generateToken(
        { id: student.id },
        this.jwtService,
      );

      await writeToCookie(refresh_token, res);

      return {
        statusCode: HttpStatus.OK,
        message: 'Logged in successfully',
        data: {
          student,
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
      const student = await this.getById(data.id);
      res.clearCookie('refresh_token');
      return {
        statusCode: HttpStatus.OK,
        mesage: 'Student logged out',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: string): Promise<object> {
    try {
      const student = await this.studentRepository.findByPk(id);
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          student,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(page: number, limit: number): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const students = await this.studentRepository.findAll({
        offset,
        limit,
      });
      const total_count = await this.studentRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: students,
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

  async update(id: string, updateDto: UpdateDto): Promise<object> {
    try {
      const student = await this.studentRepository.findByPk(id);
      if (!student) {
        throw new NotFoundException('The student not found!');
      }

      student.full_name = updateDto.full_name || student.full_name;
      student.is_study = updateDto.is_study || student.is_study;

      const updated_info = await this.studentRepository.update(
        { is_study: student.is_study, full_name: student.full_name },
        { where: { id }, returning: true },
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Updated successfully',
        data: {
          student: updated_info[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updatePhone(id: string, updateDto: UpdatePhoneDto): Promise<object> {
    const { new_phone, old_phone, password } = updateDto;

    try {
      const student = await this.studentRepository.findByPk(id);
      if (!student) {
        throw new NotFoundException('The student not found!');
      }

      if (!old_phone) {
        throw new NotFoundException('Enter your old phone!');
      } 
      if (!new_phone) {
        throw new NotFoundException('Enter your new phone!');
      } 
      if (!password) {
        throw new NotFoundException('Enter your password!');
      }
      if (student.phone != old_phone) {
        throw new NotFoundException('The phone is incorrect!');
      }

      const is_match_pass = await compare(password, student.hashed_password);
      if (!is_match_pass) {
        throw new BadRequestException('The password did not valid');
      }

      const updated_info = await this.studentRepository.update(
        { ...student, phone: new_phone },
        { where: { id }, returning: true },
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Updated successfully',
        data: {
          student: updated_info[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async newPassword(id: string, updateDto: newPasswordDto): Promise<object> {
    const { phone, new_password, old_password } = updateDto;

    try {
      const student = await this.studentRepository.findByPk(id);
      if (!student) {
        throw new NotFoundException('The student not found!');
      }

      if (!phone) {
        throw new NotFoundException('Enter your phone!');
      } 
       if (!new_password) {
        throw new NotFoundException('Enter your old password!');
      } 
       if (!old_password) {
        throw new NotFoundException('Enter your new password!');
      }

      const is_match_pass = await compare(
        old_password,
        student.hashed_password,
      );
      if (!is_match_pass) {
        throw new BadRequestException('The password did not valid');
      }

      const hashed_password = await hash(new_password, 7);

      const updated_info = await this.studentRepository.update(
        { ...student, hashed_password },
        { where: { id }, returning: true },
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Updated successfully',
        data: {
          student: updated_info[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string): Promise<object> {
    try {
      const student = await this.studentRepository.findByPk(id);
      if (!student) {
        throw new NotFoundException('Student not found!');
      }
      student.destroy();
      return {
        statusCode: HttpStatus.OK,
        message: 'Deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
