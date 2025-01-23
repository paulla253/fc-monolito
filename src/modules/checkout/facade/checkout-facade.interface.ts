import {
  InputPlaceOrderCheckoutFacadeDto,
  OutputPlaceOrderCheckoutFacadeDto,
} from "./checkout-facade.dto";

export interface CheckoutFacadeInterface {
  placeOrder(
    input: InputPlaceOrderCheckoutFacadeDto
  ): Promise<OutputPlaceOrderCheckoutFacadeDto>;
}
