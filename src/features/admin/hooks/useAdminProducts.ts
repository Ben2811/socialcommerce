"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminProducts,
  updateAdminProductStatus,
  deleteAdminProduct,
} from "@/actions/admin/products";
import type {
  AdminProduct,
  UpdateAdminProductStatusInput,
} from "../types/product";

export const adminProductQueryKeys = {
  all: ["admin-products"] as const,
  lists: () => [...adminProductQueryKeys.all, "list"] as const,
  list: (page?: number, limit?: number) =>
    [...adminProductQueryKeys.lists(), { page, limit }] as const,
};

export function useAdminProducts(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: adminProductQueryKeys.list(page, limit),
    queryFn: async () => {
      const response = await getAdminProducts(page, limit);
      if (!response.success)
        throw new Error(response.message || "Failed to fetch products");
      return response.data;
    },
  });
}

export function useUpdateAdminProductStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      input,
    }: {
      productId: string;
      input: UpdateAdminProductStatusInput;
    }) => {
      const response = await updateAdminProductStatus(productId, input);
      if (!response.success)
        throw new Error(response.message || "Failed to update product status");
      return response.data as AdminProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminProductQueryKeys.lists(),
      });
    },
  });
}

export function useDeleteAdminProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await deleteAdminProduct(productId);
      if (!response.success)
        throw new Error(response.message || "Failed to delete product");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminProductQueryKeys.lists(),
      });
    },
  });
}

