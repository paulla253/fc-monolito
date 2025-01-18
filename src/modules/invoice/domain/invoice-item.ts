import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type InvoiceItemProps = {
  id?: Id;
  name: string;
  price: number;
};

export default class InvoiceItem extends BaseEntity implements AggregateRoot {
  private readonly _name: string;
  private readonly _price: number;

  constructor(props: InvoiceItemProps) {
    super(props.id);
    this._name = props.name;
    this._price = props.price;
    this.validate();
  }

  validate(): void {
    if (this._price <= 0) {
      throw new Error("Price must be greater than 0");
    }
    if (this._name.length == 0) throw new Error("Name is required");
  }

  get price(): number {
    return this._price;
  }

  get name(): string {
    return this._name;
  }
}
