import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { ProductDto } from './dto/product.dto';
import { Image } from 'src/image/models/image.model';
import { FindOptions, Op } from 'sequelize';
import { FilesService } from 'src/files/files.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(Image) private imageRepository: typeof Image,
    private readonly categoryService: CategoryService,
    private readonly fileService: FilesService,
  ) {}

  async create(productDto: ProductDto): Promise<object> {
    try {
      const product = await this.productRepository.create({
        ...productDto,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Created successfully',
        data: {
          product,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<object> {
    try {
      const products = await this.productRepository.findAll({
        include: { all: true },
      });
      return {
        statusCode: HttpStatus.OK,
        data: {
          products,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: number): Promise<object> {
    try {
      const product = await this.productRepository.findByPk(id, {
        include: { all: true },
      });
      if (!product) {
        throw new NotFoundException('Mahsulot topilmadi!');
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          product,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async detailsForMobile(id: number): Promise<object> {
    try {
      const product = await this.productRepository.findByPk(id, {
        include: { all: true },
      });
      if (!product) {
        throw new NotFoundException('Mahsulot topilmadi!');
      }
      const similar_products = await this.productRepository.findAll({
        // where: { category_id: product.category_id },
        include: { all: true },
      });
      return {
        statusCode: HttpStatus.OK,
        data: {
          product,
          share_link: `https://florify.uz/product/${id}`,
          similar_products,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getByCategoryId(
    category_id: string,
    page: number,
    limit: number,
  ): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const products = await this.productRepository.findAll({
        // where: { category_id },
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.productRepository.count({
        // where: { category_id },
      });
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        status: HttpStatus.OK,
        data: {
          records: products,
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

  async getBySalesmanId(
    salesman_id: string,
    page: number,
    limit: number,
    quantity: string,
  ): Promise<object> {
    try {
      // await this.salesmanService.getById(salesman_id);
      const offset = (page - 1) * limit;
      if (quantity == 'All') {
        const products = await this.productRepository.findAll({
          // where: { salesman_id },
          include: { all: true },
          offset,
          limit,
        });
        const total_count = await this.productRepository.count({
          // where: { salesman_id },
        });
        const total_pages = Math.ceil(total_count / limit);
        const response = {
          status: HttpStatus.OK,
          data: {
            records: products,
            pagination: {
              currentPage: Number(page),
              total_pages,
              total_count,
            },
          },
        };
        return response;
      }
      let where: any = { salesman_id };
      if (quantity == 'on_sale') {
        where.quantity = {
          [Op.ne]: 0,
        };
      } else {
        where.quantity = 0;
      }
      const products = await this.productRepository.findAll({
        where,
        offset,
        limit,
        include: { all: true },
      });
      const total_count = await this.productRepository.count({
        where,
      });
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        status: HttpStatus.OK,
        data: {
          records: products,
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

  async pagination(page: number, limit: number): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const products = await this.productRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.productRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        status: HttpStatus.OK,
        data: {
          records: products,
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

  async presents(page: number, limit: number): Promise<object> {
    try {
      const date = new Date().toISOString().slice(0, 10);
      const offset = (page - 1) * limit;
      const products = await this.productRepository.findAll({
        // where: { date },
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.productRepository.count({
        // where: { date },
      });
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        status: HttpStatus.OK,
        data: {
          records: products,
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

  async searchProduct(query?: string, page?: number): Promise<object> {
    try {
      const limit = 10;
      const offset = (page - 1) * limit;
      let products: Product[];
      let total_count: number;
      if (!query) {
        products = await this.productRepository.findAll({
          include: { all: true },
          offset,
          limit,
        });
        total_count = await this.productRepository.count();
      } else {
        products = await this.productRepository.findAll({
          // where: { name: { [Op.iLike]: `%${query}%` } },
          include: { all: true },
          offset,
          limit,
        });
        // total_count = await this.productRepository.count({
        //   where: { name: { [Op.iLike]: `%${query}%` } },
        // });
      }
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        status: HttpStatus.OK,
        data: {
          records: products,
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

  async update(id: number, productDto: ProductDto): Promise<object> {
    try {
      const product = await this.productRepository.findByPk(id);
      if (!product) {
        throw new NotFoundException('Not found!');
      }
      const { category_id } = productDto;
      if (category_id) {
        await this.categoryService.getById(category_id);
      }
      const obj = Object.assign(productDto);
      const update = await this.productRepository.update(productDto, {
        where: { id },
        returning: true,
      });
      console.log(update);
      return {
        statusCode: HttpStatus.OK,
        message: "Updated successfully",
        data: {
          product: update[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: number): Promise<object> {
    try {
      const product = await this.productRepository.findByPk(id);
      if (!product) {
        throw new NotFoundException('Not found!');
      }
      const images = await this.imageRepository.findAll({
        where: { product_id: id },
      });
      for (let i = 0; i < images.length; i++) {
        if (images[i].image) {
          await this.fileService.deleteFile(images[i].image);
        }
      }
      product.destroy();
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: 'Deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
