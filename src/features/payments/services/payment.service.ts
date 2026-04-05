import { apiClient } from "@/features/shared/api/client";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import type { BaseResponse } from "@/types/global.types";
import type {
  CreateVnpayPaymentInput,
  CreateVnpayPaymentResponse,
} from "../types/payment";

export type { CreateVnpayPaymentInput, CreateVnpayPaymentResponse };

interface IPaymentService {
  createVnpayPaymentUrl(
    input: CreateVnpayPaymentInput,
    token?: string | null,
  ): Promise<BaseResponse<CreateVnpayPaymentResponse>>;
}

export class PaymentService implements IPaymentService {
  private url(path: string): string {
    return new URLBuilder()
      .addPath(API_ENDPOINTS.payments)
      .addParam(path)
      .build();
  }

  async createVnpayPaymentUrl(
    input: CreateVnpayPaymentInput,
    token?: string | null,
  ): Promise<BaseResponse<CreateVnpayPaymentResponse>> {
    return apiClient.post<CreateVnpayPaymentInput, CreateVnpayPaymentResponse>(
      this.url("vnpay/create-payment-url"),
      input,
      token,
    );
  }
}

export const paymentService = new PaymentService();
