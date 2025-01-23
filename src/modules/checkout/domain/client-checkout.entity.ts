import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";

type Input = {
  id?: Id;
  name: string;
  email: string;
  document: string;
  address: Address;
};

export class ClientCheckoutEntity extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _email: string;
  private _document: string;
  private _address: Address;

  constructor({ id, name, email, document, address }: Input) {
    super(id);
    this._name = name;
    this._email = email;
    this._document = document;
    this._address = address;
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  get document() {
    return this._document;
  }

  get address() {
    return this._address;
  }
}
