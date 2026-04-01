import { apiClient } from "@/features/shared/api/client";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import type { BaseResponse } from "@/types/global.types";
import type {
  CartItem,
  CartApiItem,
  CartApiResponse,
  AddCartItemInput,
  UpdateCartItemInput,
  RemoveCartItemInput,
  CartSummary,
} from "../types/cart";

export type {
  CartApiItem,
  CartApiResponse,
  AddCartItemInput,
  UpdateCartItemInput,
  RemoveCartItemInput,
  CartSummary,
};

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
    productId: item.productId,
    sku: item.sku,
    name: item.productName,
    price: item.price,
    image: item.imageUrls[0] ?? "",
    quantity: item.quantity,
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