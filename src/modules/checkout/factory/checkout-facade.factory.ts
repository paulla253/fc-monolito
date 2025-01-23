import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import { CheckoutFacade } from "../facade/checkout.facade";
import { CheckoutRepository } from "../repository/checkout.repository";
import { PlaceOrderUseCase } from "../use-case/place-order/place-order.use-case";

export class CheckoutFacadeFactory {
  static create() {
    const clientFacade = ClientAdmFacadeFactory.create();
    const productAdminFacade = ProductAdmFacadeFactory.create();
    const productStoreCatalogFacade = StoreCatalogFacadeFactory.create();
    const orderRepository = new CheckoutRepository();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();

    const placeOrderUseCase = new PlaceOrderUseCase(
      clientFacade,
      productAdminFacade,
      productStoreCatalogFacade,
      orderRepository,
      invoiceFacade,
      paymentFacade
    );

    return new CheckoutFacade({ placeOrderUseCase });
  }
}
