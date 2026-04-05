export interface CartItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  imageUrls: string[];
  category: {
    name: string;
    slug: string;
  };
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