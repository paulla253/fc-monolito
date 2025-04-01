export interface GenerateInvoiceInputDto {
  name: string;
  document: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipcode: string;
  items: {
    id?: string;
    name: string;
    price: number;
  }[];
}

export interface GenerateInvoiceOutputDto {
  id: string;
  name: string;
  document: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipcode: string;
  items: {
    id: string;
    name: string;
    price: number;
  }[];
  total: number;
}

export interface FindInvoiceUseCaseInputDTO {
  id: string;
}

export interface FindInvoiceUseCaseOutputDTO {
  id: string;
  name: string;
  document: string;
  address: {
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipcode: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
  }[];
  total: number;
  createdAt: Date;
}

export default interface InvoiceFacadeInterface {
  generate(input: GenerateInvoiceInputDto): Promise<GenerateInvoiceOutputDto>;
  find(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO>;
}
