import { Sequelize } from "sequelize-typescript";
import Invoice from "../domain/invoice";
import Address from "../../@shared/domain/value-object/address";
import { InvoiceRepository } from "./invoice.repository";
import { InvoiceModel } from "../../../migration/model/invoice.model";
import { InvoiceItemModel } from "../../../migration/model/invoice.item.model";

const input = new Invoice({
  name: "John Doe",
  document: "12345678900",
  address: new Address({
    street: "Street",
    number: "123",
    complement: "Complement",
    city: "City",
    state: "State",
    zipcode: "12345678",
  }),
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
});

describe("Integration test Invoice repository", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find an invoice", async () => {
    const invoiceRepository = new InvoiceRepository();

    await invoiceRepository.save(input);

    const output = await invoiceRepository.find(input.id.id);

    expect(output.id.id).toBe(input.id.id);
    expect(output.name).toBe(input.name);
    expect(output.document).toBe(input.document);
    expect(output.address.street).toBe(input.address.street);
    expect(output.address.number).toBe(input.address.number);
    expect(output.address.complement).toBe(input.address.complement);
    expect(output.address.city).toBe(input.address.city);
    expect(output.address.state).toBe(input.address.state);
    expect(output.address.zipcode).toBe(input.address.zipcode);
    expect(output.items.length).toBe(input.items.length);
    expect(output.items[0].id.id).toBe(input.items[0].id.id);
    expect(output.items[0].name).toBe(input.items[0].name);
    expect(output.items[0].price).toBe(input.items[0].price);
    expect(output.items[1].id.id).toBe(input.items[1].id.id);
    expect(output.items[1].name).toBe(input.items[1].name);
    expect(output.items[1].price).toBe(input.items[1].price);
  });

  it("should create an invoice", async () => {
    const invoiceRepository = new InvoiceRepository();

    await invoiceRepository.save(input);

    const output = await InvoiceModel.findOne({
      where: { id: input.id.id },
      include: [InvoiceItemModel],
    });

    expect(output.id).toBe(input.id.id);
    expect(output.name).toBe(input.name);
    expect(output.document).toBe(input.document);
    expect(output.street).toBe(input.address.street);
    expect(output.number).toBe(input.address.number);
    expect(output.complement).toBe(input.address.complement);
    expect(output.city).toBe(input.address.city);
    expect(output.state).toBe(input.address.state);
    expect(output.zipcode).toBe(input.address.zipcode);
    expect(output.items.length).toBe(input.items.length);
    expect(output.items[0].id).toBe(input.items[0].id.id);
    expect(output.items[0].name).toBe(input.items[0].name);
    expect(output.items[0].price).toBe(input.items[0].price);
    expect(output.items[1].id).toBe(input.items[1].id.id);
    expect(output.items[1].name).toBe(input.items[1].name);
    expect(output.items[1].price).toBe(input.items[1].price);
  });
});
