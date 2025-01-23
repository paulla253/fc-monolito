import { PlaceOrderUseCase } from "./place-order.use-case";
import { InputPlaceOrderUseCaseDto } from "./place-order.dto";
import Id from "../../../@shared/domain/value-object/id.value-object";
import { ProductStoreCheckoutEntity } from "../../domain/product-store-checkout.entity";
import Address from "../../../@shared/domain/value-object/address";

const mockDate = new Date("2021-01-01T00:00:00.000Z");

describe("Unit test Checkout use case", () => {
  describe("Execute method", () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(mockDate));
    });
    afterAll(() => jest.useRealTimers());
    it("should throw an error when client not found", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
      };
      // @ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase();
      // @ts-expect-error - force set client facade
      placeOrderUseCase["_clientFacade"] = mockClientFacade;
      const input: InputPlaceOrderUseCaseDto = {
        id: "0",
        clientId: "0",
        products: [],
      };
      await expect(placeOrderUseCase.execute(input)).rejects.toThrowError(
        new Error("Client not found")
      );
    });

    it("should throw an error when products are not valid", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(true),
      };
      // @ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase();
      const mockValidateProducts = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "validateProducts")
        // @ts-expect-error - not return never
        .mockRejectedValue(new Error("No products selected"));
      // @ts-expect-error - force set client facade
      placeOrderUseCase["_clientFacade"] = mockClientFacade;
      const input: InputPlaceOrderUseCaseDto = {
        id: "0",
        clientId: "123",
        products: [],
      };
      await expect(placeOrderUseCase.execute(input)).rejects.toThrowError(
        new Error("No products selected")
      );
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
    });

    describe("Place an order", () => {
      const address = new Address({
        street: "Street 1",
        number: "123",
        complement: "Complement",
        city: "City",
        state: "State",
        zipCode: "12345678",
      });

      const client = {
        id: "1c",
        name: "John Doe",
        document: "123456789",
        email: "johndoe@test.com",
        address: address,
      };
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(client),
      };
      const mockPaymentFacade = { process: jest.fn() };
      const mockCheckoutRepository = { addOrder: jest.fn() };
      const mockInvoiceFacade = {
        generate: jest.fn().mockResolvedValue({ id: "1i" }),
      };
      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade as any,
        null,
        null,
        mockCheckoutRepository as any,
        mockInvoiceFacade as any,
        mockPaymentFacade
      );
      const products = {
        "1": new ProductStoreCheckoutEntity({
          id: new Id("1"),
          orderId: new Id("1"),
          name: "Product 1",
          description: "Product 1 description",
          salesPrice: 40,
        }),
        "2": new ProductStoreCheckoutEntity({
          id: new Id("2"),
          orderId: new Id("1"),
          name: "Product 2",
          description: "Product 2 description",
          salesPrice: 30,
        }),
      };
      const mockValidateProducts = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "validateProducts")
        // @ts-expect-error - not return never
        .mockResolvedValue(null);
      const mockGetProduct = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "getProduct")
        // @ts-expect-error - not return never
        .mockImplementation((productId: keyof typeof products) => {
          return products[productId];
        });

      it("should not be approved", async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: "1t",
          orderId: "1o",
          amount: 100,
          status: "error",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        const input: InputPlaceOrderUseCaseDto = {
          id: "1o",
          clientId: "1c",
          products: [{ productId: "1" }, { productId: "2" }],
        };
        let output = await placeOrderUseCase.execute(input);
        expect(output.invoiceId).toBeNull();
        expect(output.total).toBe(70);
        expect(output.products).toStrictEqual([
          { productId: "1" },
          { productId: "2" },
        ]);
        expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
        expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        expect(mockValidateProducts).toHaveBeenCalledWith(input);
        expect(mockGetProduct).toHaveBeenCalledTimes(2);
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        });
        expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
      });

      it("should be approved", async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: "1t",
          orderId: "1o",
          amount: 100,
          status: "approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        const input: InputPlaceOrderUseCaseDto = {
          id: "1o",
          clientId: "1c",
          products: [{ productId: "1" }, { productId: "2" }],
        };
        const output = await placeOrderUseCase.execute(input);
        expect(output.invoiceId).toBe("1i");
        expect(output.total).toBe(70);
        expect(output.products).toStrictEqual([
          { productId: "1" },
          { productId: "2" },
        ]);
        expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
        expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        expect(mockGetProduct).toHaveBeenCalledTimes(2);
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        });
        expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
        expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
          name: client.name,
          document: client.document,
          street: client.address.street,
          number: client.address.number,
          complement: client.address.complement,
          city: client.address.city,
          state: client.address.state,
          zipCode: client.address.zipCode,
          items: [
            {
              id: products["1"].id.id,
              name: products["1"].name,
              price: products["1"].salesPrice,
            },
            {
              id: products["2"].id.id,
              name: products["2"].name,
              price: products["2"].salesPrice,
            },
          ],
        });
      });
    });
  });

  describe("validateProducts method", () => {
    // @ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase();

    it("should throw error if no products are selected", async () => {
      const input: InputPlaceOrderUseCaseDto = {
        id: "0",
        clientId: "0",
        products: [],
      };
      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("No products selected"));
    });

    it("should throw an error when product is out of stock", async () => {
      const mockProductFacade = {
        checkStock: jest.fn(({ productId }: { productId: string }) =>
          Promise.resolve({
            productId,
            stock: productId === "1" ? 0 : 1,
          })
        ),
      };
      // @ts-expect-error - force set product facade
      placeOrderUseCase["_productFacade"] = mockProductFacade;
      let input: InputPlaceOrderUseCaseDto = {
        id: "0",
        clientId: "0",
        products: [{ productId: "1" }],
      };
      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 is not available in stock"));
      input = {
        id: "0",
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }],
      };
      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 is not available in stock"));
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);
      input = {
        id: "0",
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }],
      };
      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 is not available in stock"));
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);
    });
  });

  describe("getProducts method", () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(mockDate));
    });
    afterAll(() => jest.useRealTimers());
    // @ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase();

    it("should throw an error when product not found", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue(null),
      };
      // @ts-expect-error - force set catalog facade
      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;
      await expect(
        placeOrderUseCase["getProduct"]("0", "1")
      ).rejects.toThrowError(new Error("Product not found"));
    });

    it("should return a product", async () => {
      const input = {
        id: "1",
        name: "Product 1",
        description: "Product 1 description",
        salesPrice: 100,
      };
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue(input),
      };
      // @ts-expect-error - force set catalog facade
      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;
      await expect(
        placeOrderUseCase["getProduct"](input.id, "1")
      ).resolves.toEqual(
        new ProductStoreCheckoutEntity({
          id: new Id(input.id),
          orderId: new Id("1"),
          name: input.name,
          description: input.description,
          salesPrice: input.salesPrice,
        })
      );
    });
  });
});
