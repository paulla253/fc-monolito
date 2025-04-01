import express, { Request, Response } from "express";
import AddClientUseCase from "../../modules/client-adm/usecase/add-client/add-client.usecase";
import ClientRepository from "../../modules/client-adm/repository/client.repository";
import FindClientUseCase from "../../modules/client-adm/usecase/find-client/find-client.usecase";
import Address from "../../modules/@shared/domain/value-object/address";

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
  const usecase = new AddClientUseCase(new ClientRepository());
  try {
    const clientDto = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: new Address({
        street: req.body.address.street,
        number: req.body.address.number,
        city: req.body.address.city,
        zipcode: req.body.address.zipcode,
        state: req.body.address.state,
        complement: req.body.address.complement,
      }),
    };
    const output = await usecase.execute(clientDto);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});

clientRoute.get("/:id", async (req: Request, res: Response) => {
  const usecase = new FindClientUseCase(new ClientRepository());
  const output = await usecase.execute({ id: req.params.id });
  res.format({
    json: async () => res.send(output),
  });
});
