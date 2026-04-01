"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAuthToken } from "@/actions/auth/getToken";
import { cartService } from "../services/cart.service";
import type {
  AddCartItemInput,
  CartItem,
  RemoveCartItemInput,
  UpdateCartItemInput,
} from "../types/cart";

type CartResponseData = CartItem[] | { items?: CartItem[] } | null | undefined;

function extractCartItems(data: CartResponseData): CartItem[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;

  if (typeof data === "object" && data !== null && "items" in data) {
    const items = data.items;
    return Array.isArray(items) ? items : [];
  }

  return [];
}

export const cartQueryKeys = {
  all: ["cart"] as const,
  cart: () => [...cartQueryKeys.all, "detail"] as const,
};

export function useCart() {
  return useQuery({
    queryKey: cartQueryKeys.cart(),
    queryFn: async () => {
      const token = await getAuthToken();

      if (!token) {
        return [];
      }

      const response = await cartService.getCart(token);

      if (!response.success) {
        throw new Error(response.message || "Không thể lấy giỏ hàng");
      }

      return extractCartItems(response.data as CartResponseData);
    },
    initialData: [],
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddCartItemInput) => {
      const token = await getAuthToken();
      const response = await cartService.addToCart(input, token);

      if (!response.success) {
        throw new Error(
          response.message || "Không thể thêm sản phẩm vào giỏ hàng",
        );
      }

      return extractCartItems(response.data as CartResponseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.cart() });
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Thêm vào giỏ hàng thất bại");
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateCartItemInput) => {
      const token = await getAuthToken();
      const response = await cartService.updateCartItem(input, token);

      if (!response.success) {
        throw new Error(
          response.message || "Không thể cập nhật sản phẩm trong giỏ hàng",
        );
      }

      return extractCartItems(response.data as CartResponseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.cart() });
      toast.success("Đã cập nhật giỏ hàng!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Cập nhật giỏ hàng thất bại");
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RemoveCartItemInput) => {
      const token = await getAuthToken();
      const response = await cartService.removeFromCart(input, token);

      if (!response.success) {
        throw new Error(
          response.message || "Không thể xóa sản phẩm khỏi giỏ hàng",
        );
      }

      return extractCartItems(response.data as CartResponseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.cart() });
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Xóa khỏi giỏ hàng thất bại");
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const token = await getAuthToken();
      const response = await cartService.clearCart(token);

      if (!response.success) {
        throw new Error(response.message || "Không thể xóa giỏ hàng");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.cart() });
      toast.success("Đã xóa toàn bộ giỏ hàng!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Xóa giỏ hàng thất bại");
    },
  });
}