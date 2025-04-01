import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoice = new Invoice({
  id: new Id("123"),
  name: "John Doe",
  document: "123456789",
  address: {
    street: "Rua 1",
    number: "123",
    complement: "Casa",
    city: "Sao Paulo",
    state: "SP",
    zipcode: "12345678",
  },
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

const MockRepository = () => {
  return {
    save: jest.fn(),
    find: jest.fn().mockResolvedValue(invoice),
  };
};

describe("Find Invoice unit test", () => {
  it("should find invoice", async () => {
    const invoiceRepository = MockRepository();

    const usecase = new FindInvoiceUseCase(invoiceRepository);
    const input = {
      id: "123",
    };

    const result = await usecase.execute(input);

    expect(invoiceRepository.find).toHaveBeenCalled();
    expect(result.id).toBe("123");
    expect(result.name).toBe("John Doe");
    expect(result.document).toBe("123456789");
    expect(result.address.street).toBe("Rua 1");
    expect(result.address.number).toBe("123");
    expect(result.address.complement).toBe("Casa");
    expect(result.address.city).toBe("Sao Paulo");
    expect(result.address.state).toBe("SP");
    expect(result.address.zipcode).toBe("12345678");
    expect(result.total).toBe(30);
  });
});
