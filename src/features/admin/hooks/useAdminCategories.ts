"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from "@/actions/admin/categories";
import type {
  AdminCategory,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types/category";

export const adminCategoryQueryKeys = {
  all: ["admin-categories"] as const,
  lists: () => [...adminCategoryQueryKeys.all, "list"] as const,
};

export function useAdminCategories() {
  return useQuery({
    queryKey: adminCategoryQueryKeys.lists(),
    queryFn: async () => {
      const response = await getAdminCategories();
      if (!response.success)
        throw new Error(response.message || "Failed to fetch categories");
      return response.data as AdminCategory[];
    },
  });
}

export function useCreateAdminCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCategoryInput) => {
      const response = await createAdminCategory(input);
      if (!response.success)
        throw new Error(response.message || "Failed to create category");
      return response.data as AdminCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoryQueryKeys.lists() });
    },
  });
}

export function useUpdateAdminCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      categoryId,
      input,
    }: {
      categoryId: string;
      input: UpdateCategoryInput;
    }) => {
      const response = await updateAdminCategory(categoryId, input);
      if (!response.success)
        throw new Error(response.message || "Failed to update category");
      return response.data as AdminCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoryQueryKeys.lists() });
    },
  });
}

export function useDeleteAdminCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await deleteAdminCategory(categoryId);
      if (!response.success)
        throw new Error(response.message || "Failed to delete category");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoryQueryKeys.lists() });
    },
  });
}
