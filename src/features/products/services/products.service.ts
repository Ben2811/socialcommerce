import { Product } from "@/features/products/types/product.interface";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import { BaseResponse, PaginationResponse } from "@/types/global.types";
import { apiClient } from "@/features/shared/api/client";

interface IProductService {
  getProducts(): Promise<BaseResponse<PaginationResponse<Product>>>;
}

export class ProductService implements IProductService {
  async getProducts(): Promise<BaseResponse<PaginationResponse<Product>>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.products)
      .build();

    return apiClient.get<PaginationResponse<Product>>(url);
  }
}

export const productService = new ProductService();
