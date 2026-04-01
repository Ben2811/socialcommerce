import { apiClient } from "@/features/shared/api/client";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import type { BaseResponse } from "@/types/global.types";
import type {
  CartItem,
  AddCartItemInput,
  UpdateCartItemInput,
  RemoveCartItemInput,
} from "../types/cart";

export type {
  CartItem,
  AddCartItemInput,
  UpdateCartItemInput,
  RemoveCartItemInput,
};

interface ICartService {
  getCart(token?: string | null): Promise<BaseResponse<CartItem[]>>;
  addToCart(
    input: AddCartItemInput,
    token?: string | null,
  ): Promise<BaseResponse<CartItem[]>>;
  updateCartItem(
    input: UpdateCartItemInput,
    token?: string | null,
  ): Promise<BaseResponse<CartItem[]>>;
  removeFromCart(
    input: RemoveCartItemInput,
    token?: string | null,
  ): Promise<BaseResponse<CartItem[]>>;
  clearCart(token?: string | null): Promise<BaseResponse<null>>;
}

export class CartService implements ICartService {
  private url(path?: string): string {
    const builder = new URLBuilder().addPath(API_ENDPOINTS.cart);
    if (path) builder.addParam(path);
    return builder.build();
  }

  async getCart(token?: string | null): Promise<BaseResponse<CartItem[]>> {
    return apiClient.get<CartItem[]>(this.url(), token);
  }

  async addToCart(
    input: AddCartItemInput,
    token?: string | null,
  ): Promise<BaseResponse<CartItem[]>> {
    return apiClient.post<AddCartItemInput, CartItem[]>(
      this.url("items"),
      input,
      token,
    );
  }

  async updateCartItem(
    input: UpdateCartItemInput,
    token?: string | null,
  ): Promise<BaseResponse<CartItem[]>> {
    return apiClient.put<UpdateCartItemInput, CartItem[]>(
      this.url("items"),
      input,
      token,
    );
  }

  async removeFromCart(
    input: RemoveCartItemInput,
    token?: string | null,
  ): Promise<BaseResponse<CartItem[]>> {
    const { productId, sku } = input;

    return apiClient.delete<CartItem[]>(
      this.url(`items/${encodeURIComponent(productId)}/${encodeURIComponent(sku)}`),
      token,
    );
  }

  async clearCart(token?: string | null): Promise<BaseResponse<null>> {
    return apiClient.delete<null>(this.url(), token);
  }
}

export const cartService = new CartService();