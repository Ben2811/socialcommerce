import { apiClient } from "@/features/shared/api/client";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import type { BaseResponse } from "@/types/global.types";
import type { CartItem } from "../types/cart";

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

interface ICartService {
  getCart(token?: string | null): Promise<BaseResponse<CartApiResponse>>;
  addToCart(
    input: AddCartItemInput,
    token?: string | null,
  ): Promise<BaseResponse<CartApiResponse>>;
  updateCartItem(
    input: UpdateCartItemInput,
    token?: string | null,
  ): Promise<BaseResponse<CartApiResponse>>;
  removeFromCart(
    input: RemoveCartItemInput,
    token?: string | null,
  ): Promise<BaseResponse<CartApiResponse>>;
  clearCart(token?: string | null): Promise<BaseResponse<null>>;
}

function mapCartApiItemToCartItem(item: CartApiItem): CartItem {
  return {
    id: Number.parseInt(item.productId.slice(-8), 16) || 0,
    name: item.productName,
    price: item.price,
    image: item.imageUrls[0] ?? "",
    quantity: item.quantity,
    category: "",
    shopName: "",
    shopId: 0,
  };
}

function getCartSummary(items: CartApiItem[], totalAmount: number): CartSummary {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    itemCount: items.length,
    totalQuantity,
    totalAmount,
  };
}

export class CartService implements ICartService {
  private url(path?: string): string {
    const builder = new URLBuilder().addPath(API_ENDPOINTS.cart);
    if (path) builder.addParam(path);
    return builder.build();
  }

  async getCart(token?: string | null): Promise<BaseResponse<CartApiResponse>> {
    return apiClient.get<CartApiResponse>(this.url(), token);
  }

  async addToCart(
    input: AddCartItemInput,
    token?: string | null,
  ): Promise<BaseResponse<CartApiResponse>> {
    return apiClient.post<AddCartItemInput, CartApiResponse>(
      this.url("items"),
      input,
      token,
    );
  }

  async updateCartItem(
    input: UpdateCartItemInput,
    token?: string | null,
  ): Promise<BaseResponse<CartApiResponse>> {
    return apiClient.put<UpdateCartItemInput, CartApiResponse>(
      this.url("items"),
      input,
      token,
    );
  }

  async removeFromCart(
    input: RemoveCartItemInput,
    token?: string | null,
  ): Promise<BaseResponse<CartApiResponse>> {
    const { productId, sku } = input;

    return apiClient.delete<CartApiResponse>(
      this.url(`items/${encodeURIComponent(productId)}/${encodeURIComponent(sku)}`),
      token,
    );
  }

  async clearCart(token?: string | null): Promise<BaseResponse<null>> {
    return apiClient.delete<null>(this.url(), token);
  }

  mapItem(item: CartApiItem): CartItem {
    return mapCartApiItemToCartItem(item);
  }

  summarize(items: CartApiItem[], totalAmount: number): CartSummary {
    return getCartSummary(items, totalAmount);
  }
}

export const cartService = new CartService();