import { apiClient } from "@/features/shared/api/client";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import { BaseResponse } from "@/types/global.types";
import { Category } from "../types";

interface ICategoriesService {
  getCategories(): Promise<BaseResponse<Category[]>>;
}

export class CategoriesService implements ICategoriesService {
  async getCategories(): Promise<BaseResponse<Category[]>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.categories)
      .build();
    
    return apiClient.get<Category[]>(url);
  }
}

export const categoriesService = new CategoriesService();
