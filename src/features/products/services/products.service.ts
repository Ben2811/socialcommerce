import { Product } from "@/features/products/types/product.interface";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import { apiClient } from "@/features/shared/api/client";
import { BaseResponse, PaginationResponse } from "@/types/global.types";
import { ProductFilter } from "../types";

interface IProductService {
  getProducts(
    filter?: ProductFilter,
  ): Promise<BaseResponse<PaginationResponse<Product>>>;
  getProductById(id: string): Promise<BaseResponse<Product>>;
}

export class ProductService implements IProductService {
  async getProducts(
    filter: ProductFilter = {},
  ): Promise<BaseResponse<PaginationResponse<Product>>> {
    const searchParams = Object.fromEntries(
      Object.entries(filter).filter(([, value]) => value !== undefined && value !== null && value !== ""),
    ) as Record<string, string | number | boolean>;

    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.products)
      .addSearchParams(searchParams)
      .build();

    return apiClient.get<PaginationResponse<Product>>(url);
  }

  async getProductById(id: string): Promise<BaseResponse<Product>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.products)
      .addParam(id)
      .build();

    return apiClient.get<Product>(url);
  }
}

export const productService = new ProductService();