import { apiClient } from "@/features/shared/api/client";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import type { BaseResponse } from "@/types/global.types";
import type {
  Order,
  CreateOrderInput,
  UpdateOrderInput,
  OrdersListResponse,
} from "../types/order";

export type {
  Order,
  CreateOrderInput,
  UpdateOrderInput,
  OrdersListResponse,
};

interface IOrderService {
  getAllOrders(page?: number, limit?: number, token?: string | null): Promise<BaseResponse<OrdersListResponse>>;
  getMyOrders(page?: number, limit?: number, token?: string | null): Promise<BaseResponse<OrdersListResponse>>;
  getSellerOrders(page?: number, limit?: number, token?: string | null): Promise<BaseResponse<OrdersListResponse>>;
  getOrderById(id: string, token?: string | null): Promise<BaseResponse<Order>>;
  createOrder(input: CreateOrderInput, token?: string | null): Promise<BaseResponse<Order>>;
  updateOrder(id: string, input: UpdateOrderInput, token?: string | null): Promise<BaseResponse<Order>>;
  cancelOrder(id: string, token?: string | null): Promise<BaseResponse<Order>>;
  confirmCodOrder(id: string, token?: string | null): Promise<BaseResponse<Order>>;
  deleteOrder(id: string, token?: string | null): Promise<BaseResponse<null>>;
}

export class OrderService implements IOrderService {
  private url(path?: string): string {
    const builder = new URLBuilder().addPath(API_ENDPOINTS.orders);
    if (path) builder.addParam(path);
    return builder.build();
  }

  private addPaginationParams(url: string, page?: number, limit?: number): string {
    let finalUrl = url;
    if (page !== undefined) {
      finalUrl += `${url.includes("?") ? "&" : "?"}page=${page}`;
    }
    if (limit !== undefined) {
      finalUrl += `${finalUrl.includes("?") ? "&" : "?"}limit=${limit}`;
    }
    return finalUrl;
  }

  async getAllOrders(
    page?: number,
    limit?: number,
    token?: string | null,
  ): Promise<BaseResponse<OrdersListResponse>> {
    const url = this.addPaginationParams(this.url(), page, limit);
    return apiClient.get<OrdersListResponse>(url, token);
  }

  async getMyOrders(
    page?: number,
    limit?: number,
    token?: string | null,
  ): Promise<BaseResponse<OrdersListResponse>> {
    const url = this.addPaginationParams(this.url("my"), page, limit);
    return apiClient.get<OrdersListResponse>(url, token);
  }

  async getSellerOrders(
    page?: number,
    limit?: number,
    token?: string | null,
  ): Promise<BaseResponse<OrdersListResponse>> {
    const baseUrl = new URLBuilder()
      .addPath(API_ENDPOINTS.seller.orders)
      .build();
    const url = this.addPaginationParams(baseUrl, page, limit);
    return apiClient.get<OrdersListResponse>(url, token);
  }

  async getOrderById(
    id: string,
    token?: string | null,
  ): Promise<BaseResponse<Order>> {
    return apiClient.get<Order>(this.url(id), token);
  }

  async createOrder(
    input: CreateOrderInput,
    token?: string | null,
  ): Promise<BaseResponse<Order>> {
    return apiClient.post<CreateOrderInput, Order>(
      this.url(),
      input,
      token,
    );
  }

  async updateOrder(
    id: string,
    input: UpdateOrderInput,
    token?: string | null,
  ): Promise<BaseResponse<Order>> {
    return apiClient.patch<UpdateOrderInput, Order>(
      this.url(id),
      input,
      token,
    );
  }

  async cancelOrder(
    id: string,
    token?: string | null,
  ): Promise<BaseResponse<Order>> {
    return apiClient.post<null, Order>(
      this.url(`${id}/cancel`),
      null,
      token,
    );
  }

  async confirmCodOrder(
    id: string,
    token?: string | null,
  ): Promise<BaseResponse<Order>> {
    return apiClient.post<null, Order>(
      this.url(`${id}/confirm-cod`),
      null,
      token,
    );
  }

  async deleteOrder(
    id: string,
    token?: string | null,
  ): Promise<BaseResponse<null>> {
    return apiClient.delete<null>(this.url(id), token);
  }
}

export const orderService = new OrderService();