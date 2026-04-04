import { apiClient } from "@/features/shared/api/client";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import type { BaseResponse, PaginationResponse } from "@/types/global.types";
import type {
  CreateSellerProductInput,
  SellerProduct,
  SellerProductsFilter,
  UpdateSellerProductInput,
  UpdateSellerProductStockInput,
} from "../types/product";

interface ISellerProductsService {
  getProducts(
    filter?: SellerProductsFilter,
    token?: string,
  ): Promise<BaseResponse<PaginationResponse<SellerProduct>>>;
  createProduct(
    input: CreateSellerProductInput,
    token: string,
  ): Promise<BaseResponse<SellerProduct>>;
  updateProduct(
    id: string,
    input: UpdateSellerProductInput,
    token: string,
  ): Promise<BaseResponse<SellerProduct>>;
  updateProductStock(
    id: string,
    input: UpdateSellerProductStockInput,
    token: string,
  ): Promise<BaseResponse<SellerProduct>>;
  deleteProduct(id: string, token: string): Promise<BaseResponse<boolean>>;
}

export class SellerProductsService implements ISellerProductsService {
  async getProducts(
    filter: SellerProductsFilter = {},
    token?: string,
  ): Promise<BaseResponse<PaginationResponse<SellerProduct>>> {
    const searchParams = Object.fromEntries(
      Object.entries(filter).filter(
        ([, value]) => value !== undefined && value !== null && value !== "",
      ),
    ) as Record<string, string | number | boolean>;

    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.seller.products)
      .addSearchParams(searchParams)
      .build();

    return apiClient.get<PaginationResponse<SellerProduct>>(url, token);
  }

  async createProduct(
    input: CreateSellerProductInput,
    token: string,
  ): Promise<BaseResponse<SellerProduct>> {
    const url = new URLBuilder().addPath(API_ENDPOINTS.products).build();
    return apiClient.post<CreateSellerProductInput, SellerProduct>(
      url,
      input,
      token,
    );
  }

  async updateProduct(
    id: string,
    input: UpdateSellerProductInput,
    token: string,
  ): Promise<BaseResponse<SellerProduct>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.products)
      .addParam(id)
      .build();

    return apiClient.patch<UpdateSellerProductInput, SellerProduct>(
      url,
      input,
      token,
    );
  }

  async updateProductStock(
    id: string,
    input: UpdateSellerProductStockInput,
    token: string,
  ): Promise<BaseResponse<SellerProduct>> {
    return this.updateProduct(id, input, token);
  }

  async deleteProduct(id: string, token: string): Promise<BaseResponse<boolean>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.products)
      .addParam(id)
      .build();

    return apiClient.delete<boolean>(url, token);
  }
}

export const sellerProductsService = new SellerProductsService();
