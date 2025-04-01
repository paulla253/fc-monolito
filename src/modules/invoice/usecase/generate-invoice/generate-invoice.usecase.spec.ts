import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
  return {
    save: jest.fn(),
    find: jest.fn(),
  };
};

describe("Generate Invoice unit test", () => {
  it("should generate invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(invoiceRepository);
    const input = {
      name: "John Doe",
      document: "123456789",
      street: "Rua 1",
      number: "123",
      complement: "Casa",
      city: "Sao Paulo",
      state: "SP",
      zipcode: "12345678",
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

    const result = await usecase.execute(input);

    expect(invoiceRepository.save).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe("John Doe");
    expect(result.document).toBe("123456789");
    expect(result.street).toBe("Rua 1");
    expect(result.number).toBe("123");
    expect(result.complement).toBe("Casa");
    expect(result.city).toBe("Sao Paulo");
    expect(result.state).toBe("SP");
    expect(result.zipcode).toBe("12345678");
    expect(result.total).toBe(30);
    expect(result.items.length).toBe(2);
  });
});
