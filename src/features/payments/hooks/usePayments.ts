"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAuthToken } from "@/actions/auth/getToken";
import { paymentService } from "../services/payment.service";
import type { CreateVnpayPaymentInput } from "../types/payment";

export function useCreateVnpayPayment() {
  return useMutation({
    mutationFn: async (input: CreateVnpayPaymentInput) => {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await paymentService.createVnpayPaymentUrl(input, token);

      if (!response.success) {
        throw new Error(response.message || "Không thể tạo URL thanh toán");
      }

      return response.data;
    },
    onSuccess: (data) => {
      window.location.href = data.paymentUrl;
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Không thể tạo thanh toán",
      );
    },
  });
}
