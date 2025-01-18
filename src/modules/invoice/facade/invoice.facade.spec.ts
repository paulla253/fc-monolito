import { Sequelize } from "sequelize-typescript";
import { InvoiceItemModel } from "../repository/invoice.item.model";
import { InvoiceModel } from "../repository/invoice.model";
import InvoiceFacadeFactory from "../factory/payment.facade.factory";

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceItemModel, InvoiceModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const invoice = {
      name: "John Doe",
      document: "123456789",
      street: "Rua 1",
      number: "123",
      complement: "Casa",
      city: "Sao Paulo",
      state: "SP",
      zipCode: "12345678",
      items: [
        {
          name: "Item 1",
          price: 10,
        },
        {
          name: "Item 2",
          price: 20,
        },
      ],
    };

    const invoiceGenerated = await facade.generate(invoice);

    const output = await facade.find({ id: invoiceGenerated.id });

    expect(output.id).toBeDefined();
    expect(output.name).toBe("John Doe");
    expect(output.document).toBe("123456789");
    expect(output.address.street).toBe("Rua 1");
    expect(output.address.number).toBe("123");
    expect(output.address.complement).toBe("Casa");
    expect(output.address.city).toBe("Sao Paulo");
    expect(output.address.state).toBe("SP");
    expect(output.address.zipCode).toBe("12345678");
    expect(output.total).toBe(30);
    expect(output.items.length).toBe(2);
  });
});
