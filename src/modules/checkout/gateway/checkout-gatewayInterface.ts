import { OrderCheckout } from "../domain/order-checkout.entity";

export interface CheckoutGatewayInterface {
  addOrder(order: OrderCheckout): Promise<void>;
  findOrder(id: string): Promise<OrderCheckout | null>;
}
