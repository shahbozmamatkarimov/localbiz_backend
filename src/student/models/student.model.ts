import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';

interface StudentAttrs {
  id: number;
  full_name: string;
  phone: string;
  hashed_password: string;
  is_study: boolean;
  image: string;
}

@Table({ tableName: 'student' })
export class Student extends Model<Student, StudentAttrs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  full_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hashed_password: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_study: boolean;

  @Column({
    type: DataType.STRING,
  })
  image: string;
}
