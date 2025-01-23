export interface InputPlaceOrderCheckoutFacadeDto {
  id: string
  clientId: string
  products: {
    productId: string
  }[]
}

export interface OutputPlaceOrderCheckoutFacadeDto {
  id: string
  invoiceId: string
  status: string
  total: number
  products: {
    productId: string
  }[]
}
