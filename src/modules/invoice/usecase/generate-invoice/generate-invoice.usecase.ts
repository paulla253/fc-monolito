import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoice-item";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceInputDto,
  GenerateInvoiceOutputDto,
} from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {
  constructor(private invoiceRepository: InvoiceGateway) {}

  async execute(
    input: GenerateInvoiceInputDto
  ): Promise<GenerateInvoiceOutputDto> {
    const invoice = new Invoice({
      ...input,
      address: {
        street: input.street,
        number: input.number,
        complement: input.complement,
        city: input.city,
        state: input.state,
        zipcode: input.zipcode,
      },
      items: input.items.map(
        (item) =>
          new InvoiceItem({
            id: new Id(item.id),
            name: item.name,
            price: item.price,
          })
      ),
    });
    const total = invoice.calculateTotal();
    await this.invoiceRepository.save(invoice);

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipcode: invoice.address.zipcode,
      items: invoice.items.map((item) => {
        return {
          id: item.id.id,
          name: item.name,
          price: item.price,
        };
      }),
      total,
    };
  }
}
