import {
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { OrderModel } from "./order.model";

@Table({
  tableName: "clients",
  timestamps: false,
})
export class ClientModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @HasMany(() => OrderModel)
  declare orders: Awaited<OrderModel[]>;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare email: string;

  @Column({ allowNull: false })
  declare document: string;

  @Column({ allowNull: false })
  street: string;

  @Column({ allowNull: false })
  number: string;

  @Column({ allowNull: true })
  complement: string;

  @Column({ allowNull: false })
  city: string;

  @Column({ allowNull: false })
  state: string;

  @Column({ allowNull: false })
  zipcode: string;

  @Column({ field: "created_at", allowNull: false })
  createdAt: Date;

  @Column({ field: "updated_at", allowNull: false })
  updatedAt: Date;
}
