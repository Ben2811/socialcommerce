export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  shopName: string;
  shopId: number;
}

export interface CartGroupByShop {
  shopId: number;
  shopName: string;
  items: CartItem[];
}
