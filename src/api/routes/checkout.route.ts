import express, { Request, Response } from "express";
import { CheckoutFacadeFactory } from "../../modules/checkout/factory/checkout-facade.factory";
export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req: Request, res: Response) => {
  try {
    const facadeCheckout = CheckoutFacadeFactory.create();
    const checkoutDto = {
      id: req.body.id,
      clientId: req.body.clientId,
      products: req.body.products.map((p: { productId: any }) => {
        return { productId: p.productId };
      }),
    };

    const output = await facadeCheckout.placeOrder(checkoutDto);

    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});

checkoutRoute.get("/", async (req: Request, res: Response) => {
  res.format({
    json: async () => res.send(),
  });
});
