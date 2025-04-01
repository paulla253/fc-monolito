import Id from "../../../@shared/domain/value-object/id.value-object";

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
