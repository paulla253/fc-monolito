import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "./invoice-item";

type InvoiceProps = {
  id?: Id;
  name: string;
  document: string;
  address: {
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items?: {
    name: string;
    price: number;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Invoice extends BaseEntity implements AggregateRoot {
  private readonly _name: string;
  private readonly _document: string;
  private readonly _address: Address;
  private readonly _items: InvoiceItem[];

  constructor(props: InvoiceProps) {
    super(props.id);
    this._name = props.name;
    this._document = props.document;
    this._address = new Address(props.address);
    this._items = props.items?.map((item) => new InvoiceItem(item));

    this.validate();
  }

  calculateTotal(): number {
    const total: number = this._items.reduce((acumulador, produto) => {
      return acumulador + produto.price;
    }, 0);

    return total;
  }

  validate(): void {
    if (this._name.length == 0) throw new Error("Name is required");
    if (this._document.length == 0) throw new Error("Document is required");
    this._items.map((item) => item.validate());
    this._address.validate();
  }

  get items(): InvoiceItem[] {
    return this._items;
  }

  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document;
  }

  get address(): Address {
    return this._address;
  }
}
