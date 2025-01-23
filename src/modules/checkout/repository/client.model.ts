import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { OrderModel } from "./order.model";

@Table({
  tableName: "order_clients",
  timestamps: false,
})
export class ClientCheckoutModel extends Model {
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
  zipCode: string;
}
