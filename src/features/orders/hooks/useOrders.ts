"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAuthToken } from "@/actions/auth/getToken";
import { orderService } from "../services/order.service";
import type {
  CreateOrderInput,
  UpdateOrderInput,
} from "../types/order";

export const orderQueryKeys = {
  all: ["orders"] as const,
  lists: () => [...orderQueryKeys.all, "list"] as const,
  list: (page: number, limit: number) =>
    [...orderQueryKeys.lists(), { page, limit }] as const,
  myLists: () => [...orderQueryKeys.all, "myList"] as const,
  myList: (page: number, limit: number) =>
    [...orderQueryKeys.myLists(), { page, limit }] as const,
  details: () => [...orderQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...orderQueryKeys.details(), id] as const,
};

export function useOrders(page = 1, limit = 10) {
  return useQuery({
    queryKey: orderQueryKeys.list(page, limit),
    queryFn: async () => {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await orderService.getAllOrders(page, limit, token);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch orders");
      }

      return response.data;
    },
    enabled: !!page,
  });
}

export function useMyOrders(page = 1, limit = 10) {
  return useQuery({
    queryKey: orderQueryKeys.myList(page, limit),
    queryFn: async () => {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await orderService.getMyOrders(page, limit, token);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch your orders");
      }

      return response.data;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export const sellerOrderQueryKeys = {
  all: ["sellerOrders"] as const,
  lists: () => [...sellerOrderQueryKeys.all, "list"] as const,
  list: (page: number, limit: number) =>
    [...sellerOrderQueryKeys.lists(), { page, limit }] as const,
};

export function useSellerOrders(page = 1, limit = 10) {
  return useQuery({
    queryKey: sellerOrderQueryKeys.list(page, limit),
    queryFn: async () => {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await orderService.getSellerOrders(page, limit, token);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch seller orders");
      }

      return response.data;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: orderQueryKeys.detail(orderId),
    queryFn: async () => {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await orderService.getOrderById(orderId, token);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch order");
      }

      return response.data;
    },
    enabled: !!orderId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await orderService.createOrder(input, token);

      if (!response.success) {
        throw new Error(response.message || "Failed to create order");
      }

      return response.data;
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.myLists() });
      queryClient.setQueryData(orderQueryKeys.detail(order._id), order);
      toast.success("Order created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create order");
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      input,
    }: {
      orderId: string;
      input: UpdateOrderInput;
    }) => {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await orderService.updateOrder(orderId, input, token);

      if (!response.success) {
        throw new Error(response.message || "Failed to update order");
      }

      return response.data;
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.myLists() });
      queryClient.setQueryData(orderQueryKeys.detail(order._id), order);
      toast.success("Order updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update order");
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await orderService.cancelOrder(orderId, token);

      if (!response.success) {
        throw new Error(response.message || "Failed to cancel order");
      }

      return response.data;
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.myLists() });
      queryClient.setQueryData(orderQueryKeys.detail(order._id), order);
      toast.success("Order cancelled successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel order");
    },
  });
}

export function useConfirmCodOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await orderService.confirmCodOrder(orderId, token);

      if (!response.success) {
        throw new Error(response.message || "Failed to confirm order");
      }

      return response.data;
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.myLists() });
      queryClient.setQueryData(orderQueryKeys.detail(order._id), order);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to confirm order");
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await orderService.deleteOrder(orderId, token);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete order");
      }

      return response.data;
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.myLists() });
      queryClient.removeQueries({ queryKey: orderQueryKeys.detail(orderId) });
      toast.success("Order deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete order");
    },
  });
}