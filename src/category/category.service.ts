import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from './models/category.model';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryDto } from './dto/category.dto';
import { Product } from 'src/product/models/product.model';
import { Image } from 'src/image/models/image.model';
import { FilesService } from 'src/files/files.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private categoryRepository: typeof Category,
    private readonly fileService: FilesService,
  ) {}

  async create(categoryDto: CategoryDto): Promise<object> {
    try {
      const category = await this.categoryRepository.create(categoryDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Created successfully',
        data: {
          category,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<object> {
    try {
      const categories = await this.categoryRepository.findAll();
      return {
        statusCode: HttpStatus.OK,
        data: {
          categories,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: number): Promise<object> {
    try {
      const category = await this.categoryRepository.findByPk(id);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          category,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number, limit: number): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const categories = await this.categoryRepository.findAll({
        offset,
        limit,
      });
      const total_count = await this.categoryRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: categories,
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

  async update(
    id: string,
    updateDto: UpdateCategoryDto,
  ): Promise<object> {
    try {
      const category = await this.categoryRepository.findByPk(id);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      const update = await this.categoryRepository.update(updateDto, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: "Updated successfully",
        data: {
          category: update[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string): Promise<object> {
    try {
      const category = await this.categoryRepository.findByPk(id);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      category.destroy();
      return {
        statusCode: HttpStatus.OK,
        message: "Deleted successfully",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
