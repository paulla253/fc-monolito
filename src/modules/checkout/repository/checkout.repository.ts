import { OrderModel } from "../../../migration/model/order.model";
import { OrderProductModel } from "../../../migration/model/order-product.model";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import { ClientCheckoutEntity } from "../domain/client-checkout.entity";
import { OrderCheckout } from "../domain/order-checkout.entity";
import { ProductStoreCheckoutEntity } from "../domain/product-store-checkout.entity";
import { CheckoutGatewayInterface } from "../gateway/checkout-gatewayInterface";

export class CheckoutRepository implements CheckoutGatewayInterface {
  async addOrder(order: OrderCheckout): Promise<void> {
    const input = {
      id: order.id.id,
      clientId: order.client.id.id,
      items: order.products.map((item) => ({
        id: item.id.id,
        orderId: order.id.id,
        name: item.name,
        description: item.description,
        salesPrice: item.salesPrice,
      })),
      status: order.status,
    };
    await OrderModel.create(input, {
      include: [OrderProductModel],
    });
  }

  async findOrder(id: string): Promise<OrderCheckout | null> {
    const order = await OrderModel.findOne({
      where: { id },
      include: ["items", "client"],
    });

    if (!order) {
      throw new Error("Order not found.");
    }

    const address = new Address({
      street: order.client.street,
      number: order.client.number,
      complement: order.client.complement,
      city: order.client.city,
      state: order.client.state,
      zipcode: order.client.zipcode,
    });

    return new OrderCheckout({
      id: new Id(order.id),
      client: new ClientCheckoutEntity({
        id: new Id(order.client.id),
        name: order.client.name,
        email: order.client.email,
        document: order.client.document,
        address: address,
      }),
      products: order.items.map((item) => {
        return new ProductStoreCheckoutEntity({
          id: new Id(item.id),
          orderId: new Id(item.orderId),
          name: item.name,
          description: item.description,
          salesPrice: item.salesPrice,
        });
      }),
    });
  }
}
