import type { AdminCategory, CreateCategoryInput, UpdateCategoryInput } from "../types/category";
import { BaseResponse, PaginationResponse } from "@/types/global.types";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import { apiClient } from "@/features/shared/api/client";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";

interface IAdminCategoriesService {
  getCategories(
    page?: number,
    limit?: number,
  ): Promise<BaseResponse<PaginationResponse<AdminCategory>>>;
  createCategory(input: CreateCategoryInput): Promise<BaseResponse<AdminCategory>>;
  updateCategory(id: string, input: UpdateCategoryInput): Promise<BaseResponse<AdminCategory>>;
  deleteCategory(id: string): Promise<BaseResponse<boolean>>;
}

export class AdminCategoriesService implements IAdminCategoriesService {
  async getCategories(
    page = 1,
    limit = 10,
  ): Promise<BaseResponse<PaginationResponse<AdminCategory>>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.categories as any)
      .addSearchParams({ page, limit })
      .build();
    return apiClient.get<PaginationResponse<AdminCategory>>(url);
  }

  async createCategory(input: CreateCategoryInput): Promise<BaseResponse<AdminCategory>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.categories as any)
      .build();
    return apiClient.post<CreateCategoryInput, AdminCategory>(url, input);
  }

  async updateCategory(id: string, input: UpdateCategoryInput): Promise<BaseResponse<AdminCategory>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.categories as any)
      .addParam(id)
      .build();
    return apiClient.patch<UpdateCategoryInput, AdminCategory>(url, input);
  }

  async deleteCategory(id: string): Promise<BaseResponse<boolean>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.categories as any)
      .addParam(id)
      .build();
    return apiClient.delete<boolean>(url);
  }
}

export const adminCategoriesService = new AdminCategoriesService();
