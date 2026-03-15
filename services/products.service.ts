import { Product } from "@/interfaces";
import { API_ENDPOINTS } from "@/lib/shared/constants/endpoints";
import { URLBuilder } from "@/lib/urlbuilder";
import { BaseResponse, PaginationResponse } from "@/types/global.types";
import { apiClient } from "./apiclient";

interface IProductService {
  getProducts: () => Promise<BaseResponse<PaginationResponse<Product>>>;
}

export class ProductService implements IProductService {
  async getProducts(): Promise<BaseResponse<PaginationResponse<Product>>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.products)
      .addSearchParams({
        page: "1",
        limit: "10",
      })
      .build();

    const response =
      await apiClient.get<BaseResponse<PaginationResponse<Product>>>(url);
    return response;
  }
}
export const productService = new ProductService();
