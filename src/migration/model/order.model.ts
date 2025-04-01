import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { ClientModel } from "./client.model";
import { OrderProductModel } from "./order-product.model";

@Table({
  tableName: "orders",
  timestamps: false,
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @ForeignKey(() => ClientModel)
  @Column({ field: "client_id", allowNull: false })
  declare clientId: string;

  @BelongsTo(() => ClientModel)
  declare client: Awaited<ClientModel>;

  @HasMany(() => OrderProductModel)
  declare items: Awaited<OrderProductModel[]>;

  @Column({ allowNull: false })
  declare status: string;
}
