import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { ClientCheckoutModel } from "./client.model";
import { ProductModel } from "./product.model";

@Table({
  tableName: "orders",
  timestamps: false,
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @ForeignKey(() => ClientCheckoutModel)
  @Column({ field: "client_id", allowNull: false })
  declare clientId: string;

  @BelongsTo(() => ClientCheckoutModel)
  declare client: Awaited<ClientCheckoutModel>;

  @HasMany(() => ProductModel)
  declare items: Awaited<ProductModel[]>;

  @Column({ allowNull: false })
  declare status: string;
}
