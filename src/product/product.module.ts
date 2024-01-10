import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { FilesModule } from 'src/files/files.module';
import { Image } from '../image/models/image.model';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Product, Image]),
    FilesModule,
    CategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
