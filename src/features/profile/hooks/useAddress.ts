"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/actions/profile/addresses";
import type { CreateAddressInput, UpdateAddressInput } from "../types/address.interface";

export const addressQueryKeys = {
  all: ["addresses"] as const,
  list: () => [...addressQueryKeys.all, "list"] as const,
};

export function useAddresses() {
  return useQuery({
    queryKey: addressQueryKeys.list(),
    queryFn: async () => {
      const res = await getAddresses();
      if (!res.success) throw new Error(res.message || "Không thể lấy danh sách địa chỉ");
      return res.data ?? [];
    },
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAddressInput) => addAddress(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressQueryKeys.list() });
      toast.success("Thêm địa chỉ thành công!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Thêm địa chỉ thất bại");
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAddressInput }) =>
      updateAddress(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressQueryKeys.list() });
      toast.success("Cập nhật địa chỉ thành công!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Cập nhật địa chỉ thất bại");
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressQueryKeys.list() });
      toast.success("Xóa địa chỉ thành công!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Xóa địa chỉ thất bại");
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressQueryKeys.list() });
      toast.success("Đã đặt địa chỉ mặc định!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Thao tác thất bại");
    },
  });
}
