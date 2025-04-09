
export interface CartItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartState {
  items: CartItemType[];
  total: number;
  count: number;
}
