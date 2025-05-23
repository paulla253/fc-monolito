import express, { Request, Response } from "express";
import GenerateInvoiceUseCase from "../../modules/invoice/usecase/generate-invoice/generate-invoice.usecase";
import { InvoiceRepository } from "../../modules/invoice/repository/invoice.repository";
import FindInvoiceUseCase from "../../modules/invoice/usecase/find-invoice/find-invoice.usecase";

export const invoiceRoute = express.Router();

invoiceRoute.get("/", async (req: Request, res: Response) => {
  const usecase = new GenerateInvoiceUseCase(new InvoiceRepository());
  try {
    const invoiceDto = {
      name: req.body.name,
      document: req.body.document,
      street: req.body.street,
      number: req.body.number,
      complement: req.body.complement,
      city: req.body.city,
      state: req.body.state,
      zipcode: req.body.zipcode,
      items: req.body.items.map((item: any) => {
        return { id: item.id, name: item.name, price: item.price };
      }),
    };
    const output = await usecase.execute(invoiceDto);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});

invoiceRoute.get("/:invoiceId", async (req: Request, res: Response) => {
  const usecase = new FindInvoiceUseCase(new InvoiceRepository());
  const output = await usecase.execute({ id: req.params.invoiceId });

  res.format({
    json: async () => res.send(output),
  });
});
