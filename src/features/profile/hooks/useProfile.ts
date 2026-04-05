"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCurrentUser, updateCurrentUser } from "@/actions/profile/profile";
import type { UpdateProfileInput } from "../types/user.interface";

export const profileQueryKeys = {
  all: ["profile"] as const,
  current: () => [...profileQueryKeys.all, "current"] as const,
};

export function useCurrentUser() {
  return useQuery({
    queryKey: profileQueryKeys.current(),
    queryFn: async () => {
      const res = await getCurrentUser();
      if (!res.success) throw new Error(res.message || "Failed to fetch user");
      return res.data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const res = await updateCurrentUser(input);
      if (!res.success) throw new Error(res.message || "Failed to update profile");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.current() });
      toast.success("Cập nhật thông tin thành công!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Cập nhật thất bại");
    },
  });
}
