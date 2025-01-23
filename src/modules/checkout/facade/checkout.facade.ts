import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import {
  InputPlaceOrderCheckoutFacadeDto,
  OutputPlaceOrderCheckoutFacadeDto,
} from "./checkout-facade.dto";
import { CheckoutFacadeInterface } from "./checkout-facade.interface";

interface UseCaseProps {
  placeOrderUseCase: UseCaseInterface;
}

export class CheckoutFacade implements CheckoutFacadeInterface {
  private _placeOrderUseCase: UseCaseInterface;

  constructor({ placeOrderUseCase }: UseCaseProps) {
    this._placeOrderUseCase = placeOrderUseCase;
  }

  async placeOrder(
    input: InputPlaceOrderCheckoutFacadeDto
  ): Promise<OutputPlaceOrderCheckoutFacadeDto> {
    const inputFacade = {
      id: input.id,
      clientId: input.clientId,
      products: input.products.map((product) => ({
        productId: product.productId,
      })),
    };
    return await this._placeOrderUseCase.execute(inputFacade);
  }
}
