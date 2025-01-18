import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO,
  GenerateInvoiceInputDto,
  GenerateInvoiceOutputDto,
} from "./facade.interface";

export default class InvoiceFacade implements InvoiceFacadeInterface {
  constructor(
    private readonly generateUseCase: UseCaseInterface,
    private readonly findUseCase: UseCaseInterface
  ) {}

  async generate(
    input: GenerateInvoiceInputDto
  ): Promise<GenerateInvoiceOutputDto> {
    return await this.generateUseCase.execute(input);
  }

  async find(
    input: FindInvoiceUseCaseInputDTO
  ): Promise<FindInvoiceUseCaseOutputDTO> {
    return await this.findUseCase.execute(input);
  }
}
