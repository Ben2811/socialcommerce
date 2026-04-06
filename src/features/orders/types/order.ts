export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  productId: string;
  sku: string;
  quantity: number;
  productName?: string;
  price?: number;
  imageUrls?: string[];
}

export interface ShippingAddress {
  street: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
}

export interface OrderUser {
  _id: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
}

export interface Order {
  _id: string;
  userId: string;
  user?: OrderUser;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  notes?: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  items: Array<{
    productId: string;
    sku: string;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
  notes?: string;
}

export interface UpdateOrderInput {
  notes?: string;
}

export interface OrdersListResponse {
  items: Order[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}