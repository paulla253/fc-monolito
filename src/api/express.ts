import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { productRoute } from "./routes/product.route";
import { ProductModel } from "../migration/model/product.model";
import { clientRoute } from "./routes/client.route";
import { invoiceRoute } from "./routes/invoice.route";
import { checkoutRoute } from "./routes/checkout.route";
import { InvoiceItemModel } from "../migration/model/invoice.item.model";
import { InvoiceModel } from "../migration/model/invoice.model";
import TransactionModel from "../migration/model/transaction.model";
import { OrderProductModel } from "../migration/model/order-product.model";
import { OrderModel } from "../migration/model/order.model";
import { ClientModel } from "../migration/model/client.model";

export const app: Express = express();
app.use(express.json());
app.use("/clients", clientRoute);
app.use("/products", productRoute);
app.use("/checkout", checkoutRoute);
app.use("/invoice", invoiceRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  sequelize.addModels([
    ProductModel,
    InvoiceItemModel,
    InvoiceModel,
    TransactionModel,
    OrderProductModel,
    OrderModel,
    ClientModel,
  ]);

  await sequelize.sync();
}
setupDb();
