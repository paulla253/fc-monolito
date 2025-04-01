import {
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { InvoiceItemModel } from "./invoice.item.model";

@Table({
  tableName: "invoice",
  timestamps: false,
})
export class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  document: string;

  @Column({ allowNull: false })
  street: string;

  @Column({ allowNull: false })
  number: string;

  @Column({ allowNull: false })
  complement: string;

  @Column({ allowNull: false })
  city: string;

  @Column({ allowNull: false })
  state: string;

  @Column({ field: "zip_code", allowNull: false })
  zipcode: string;

  @HasMany(() => InvoiceItemModel)
  items: Awaited<InvoiceItemModel[]>;

  @Column({ field: "created_at", allowNull: false })
  createdAt: Date;

  @Column({ field: "updated_at", allowNull: false })
  updatedAt: Date;
}
