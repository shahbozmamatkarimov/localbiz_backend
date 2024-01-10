import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Image } from 'src/image/models/image.model';
import { Category } from '../../category/models/category.model';
// import { Like } from 'src/like/models/like.model';

interface ProductAttributes {
  title: string;
  location: string;
  open_time: Array<string>;
  phone: string;
  direction: string;
  category_id: number;
}

@Table({ tableName: 'product' })
export class Product extends Model<Product, ProductAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  location: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  open_time: Array<string>;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  direction: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
  })
  category_id: number;

  @BelongsTo(() => Category)
  category: Category;

  @HasMany(() => Image, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  images: Image[];

  // @HasMany(() => Like, {
  //   onDelete: 'CASCADE',
  //   hooks: true,
  // })
  // likes: Like[];
}
