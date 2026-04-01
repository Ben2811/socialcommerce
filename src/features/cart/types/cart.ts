export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
  shopName?: string;
  shopId?: string;
}

export interface CartGroupByShop {
  shopId: string;
  shopName: string;
  items: CartItem[];
}

export interface CartApiItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  imageUrls: string[];
  subtotal?: number;
}

export interface CartApiResponse {
  _id: string;
  userId: string;
  items: CartApiItem[];
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddCartItemInput {
  productId: string;
  sku: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  productId: string;
  sku: string;
  quantity: number;
}

export interface RemoveCartItemInput {
  productId: string;
  sku: string;
}

export interface CartSummary {
  itemCount: number;
  totalQuantity: number;
  totalAmount: number;
}
