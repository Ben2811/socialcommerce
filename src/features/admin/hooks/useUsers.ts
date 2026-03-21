"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminUsers,
  getAdminUserById,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "@/actions/admin/users";
import type { User, CreateUserInput, UpdateUserInput } from "../types/user";

export const userQueryKeys = {
  all: ["admin-users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
  list: (page?: number, limit?: number) => [...userQueryKeys.lists(), { page, limit }] as const,
  details: () => [...userQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
};

export function useUsers(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: userQueryKeys.list(page, limit),
    queryFn: async () => {
      const response = await getAdminUsers(page, limit);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch users");
      }
      return response.data;
    },
  });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: userQueryKeys.detail(userId),
    queryFn: async () => {
      const response = await getAdminUserById(userId);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch user");
      }
      return response.data;
    },
    enabled: !!userId,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateUserInput) => {
      const response = await createAdminUser(input);
      if (!response.success) {
        throw new Error(response.message || "Failed to create user");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, input }: { userId: string; input: UpdateUserInput }) => {
      const response = await updateAdminUser(userId, input);
      if (!response.success) {
        throw new Error(response.message || "Failed to update user");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await deleteAdminUser(userId);
      if (!response.success) {
        throw new Error(response.message || "Failed to delete user");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
  });
}
