import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Product } from '../../product/models/product.model';

interface CategoryAttrs {
  id: number;
  title: string;
  description: string;
}

@Table({ tableName: 'category' })
export class Category extends Model<Category, CategoryAttrs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  title: string;

  @Column({
    type: DataType.STRING,
  })
  description: string;

  // @HasMany(() => Product, {
  //   onDelete: 'CASCADE',
  //   hooks: true,
  // })
  // products: Product[];
}
