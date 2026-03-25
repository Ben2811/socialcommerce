import type {
  AdminProduct,
  UpdateAdminProductStatusInput,
} from "../types/product";
import { BaseResponse, PaginationResponse } from "@/types/global.types";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import { apiClient } from "@/features/shared/api/client";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";

interface IAdminProductsService {
  getProducts(
    page?: number,
    limit?: number,
    token?: string,
  ): Promise<BaseResponse<PaginationResponse<AdminProduct>>>;
  updateProductStatus(
    id: string,
    input: UpdateAdminProductStatusInput,
    token: string,
  ): Promise<BaseResponse<AdminProduct>>;
  deleteProduct(id: string, token: string): Promise<BaseResponse<boolean>>;
}

export class AdminProductsService implements IAdminProductsService {
  async getProducts(
    page = 1,
    limit = 10,
    token?: string,
  ): Promise<BaseResponse<PaginationResponse<AdminProduct>>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.products)
      .addSearchParams({ page, limit })
      .build();
    return apiClient.get<PaginationResponse<AdminProduct>>(url, token);
  }

  async updateProductStatus(
    id: string,
    input: UpdateAdminProductStatusInput,
    token: string,
  ): Promise<BaseResponse<AdminProduct>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.products)
      .addParam(id)
      .addParam("status")
      .build();
    return apiClient.patch<UpdateAdminProductStatusInput, AdminProduct>(
      url,
      input,
      token,
    );
  }

  async deleteProduct(id: string, token: string): Promise<BaseResponse<boolean>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.products)
      .addParam(id)
      .build();
    return apiClient.delete<boolean>(url, token);
  }
}

export const adminProductsService = new AdminProductsService();
