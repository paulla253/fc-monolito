import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacadeInterface from "../../../invoice/facade/facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import { ClientCheckoutEntity } from "../../domain/client-checkout.entity";
import { OrderCheckout } from "../../domain/order-checkout.entity";
import { ProductStoreCheckoutEntity } from "../../domain/product-store-checkout.entity";
import { CheckoutGatewayInterface } from "../../gateway/checkout-gatewayInterface";
import {
  InputPlaceOrderUseCaseDto,
  OutputPlaceOrderUseCaseDto,
} from "./place-order.dto";

export class PlaceOrderUseCase implements UseCaseInterface {
  constructor(
    private readonly _clientFacade: ClientAdmFacadeInterface,
    private readonly _productFacade: ProductAdmFacadeInterface,
    private readonly _catalogFacade: StoreCatalogFacadeInterface,
    private readonly _repository: CheckoutGatewayInterface,
    private readonly _invoiceFacade: InvoiceFacadeInterface,
    private readonly _paymentFacade: PaymentFacadeInterface
  ) {}

  async execute(
    input: InputPlaceOrderUseCaseDto
  ): Promise<OutputPlaceOrderUseCaseDto> {
    const client = await this._clientFacade.find({ id: input.clientId });
    if (!client) {
      throw new Error("Client not found");
    }
    await this.validateProducts(input);
    const products = await Promise.all(
      input.products.map((product) =>
        this.getProduct(product.productId, input.id)
      )
    );

    const currentClient = new ClientCheckoutEntity({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      document: client.document,
      address: client.address,
    });
    const order = new OrderCheckout({
      id: new Id(input.id),
      client: currentClient,
      products,
    });
    const payment = await this._paymentFacade.process({
      orderId: order.id.id,
      amount: order.total,
    });
    const invoice =
      payment.status === "approved"
        ? await this._invoiceFacade.generate({
            name: client.name,
            document: client.document,
            street: client.address.street,
            number: client.address.number,
            complement: client.address.complement,
            city: client.address.city,
            state: client.address.state,
            zipcode: client.address.zipcode,
            items: order.products.map((product) => ({
              id: product.id.id,
              name: product.name,
              price: product.salesPrice,
            })),
          })
        : null;
    payment.status === "approved" && order.approved();
    await this._repository.addOrder(order);
    return {
      id: order.id.id,
      invoiceId: payment.status === "approved" ? invoice.id : null,
      status: order.status,
      total: order.total,
      products: order.products.map((product) => ({ productId: product.id.id })),
    };
  }

  private async validateProducts(
    input: InputPlaceOrderUseCaseDto
  ): Promise<void> {
    if (input.products.length === 0) {
      throw new Error("No products selected");
    }

    for (const product of input.products) {
      const productStock = await this._productFacade.checkStock({
        productId: product.productId,
      });
      if (productStock.stock <= 0) {
        throw new Error(
          `Product ${product.productId} is not available in stock`
        );
      }
    }
  }

  private async getProduct(
    productId: string,
    orderId: string
  ): Promise<ProductStoreCheckoutEntity> {
    const product = await this._catalogFacade.find({ id: productId });
    if (!product) {
      throw new Error(`Product not found`);
    }
    const input = {
      id: new Id(product.id),
      orderId: new Id(orderId),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };
    const productEntity = new ProductStoreCheckoutEntity(input);
    return productEntity;
  }
}
