"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSellerProduct,
  deleteSellerProduct,
  getSellerProducts,
  updateSellerProduct,
  updateSellerProductStock,
} from "@/actions/seller/products";
import type {
  CreateSellerProductInput,
  SellerProduct,
  SellerProductStatus,
  UpdateSellerProductInput,
  UpdateSellerProductStockInput,
} from "../types/product";

export const sellerProductQueryKeys = {
  all: ["seller-products"] as const,
  lists: () => [...sellerProductQueryKeys.all, "list"] as const,
  list: (
    page?: number,
    limit?: number,
    status?: SellerProductStatus,
    search?: string,
  ) =>
    [...sellerProductQueryKeys.lists(), { page, limit, status, search }] as const,
};

export function useSellerProducts(
  page: number = 1,
  limit: number = 10,
  status?: SellerProductStatus,
  search?: string,
) {
  return useQuery({
    queryKey: sellerProductQueryKeys.list(page, limit, status, search),
    queryFn: async () => {
      const response = await getSellerProducts(page, limit, status, search);
      if (!response.success)
        throw new Error(response.message || "Failed to fetch seller products");
      return response.data;
    },
  });
}

export function useCreateSellerProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSellerProductInput) => {
      const response = await createSellerProduct(input);
      if (!response.success)
        throw new Error(response.message || "Failed to create product");
      return response.data as SellerProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerProductQueryKeys.lists() });
    },
  });
}

export function useUpdateSellerProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      input,
    }: {
      productId: string;
      input: UpdateSellerProductInput;
    }) => {
      const response = await updateSellerProduct(productId, input);
      if (!response.success)
        throw new Error(response.message || "Failed to update product");
      return response.data as SellerProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerProductQueryKeys.lists() });
    },
  });
}

export function useUpdateSellerProductStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      input,
    }: {
      productId: string;
      input: UpdateSellerProductStockInput;
    }) => {
      const response = await updateSellerProductStock(productId, input);
      if (!response.success)
        throw new Error(response.message || "Failed to update stock");
      return response.data as SellerProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerProductQueryKeys.lists() });
    },
  });
}

export function useDeleteSellerProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await deleteSellerProduct(productId);
      if (!response.success)
        throw new Error(response.message || "Failed to delete product");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerProductQueryKeys.lists() });
    },
  });
}
