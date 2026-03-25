import type { AdminCategory, CreateCategoryInput, UpdateCategoryInput } from "../types/category";
import { BaseResponse, PaginationResponse } from "@/types/global.types";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import { apiClient } from "@/features/shared/api/client";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";

interface IAdminCategoriesService {
  getCategories(
    page?: number,
    limit?: number,
    token?: string,
  ): Promise<BaseResponse<PaginationResponse<AdminCategory>>>;
  createCategory(input: CreateCategoryInput, token: string): Promise<BaseResponse<AdminCategory>>;
  updateCategory(id: string, input: UpdateCategoryInput, token: string): Promise<BaseResponse<AdminCategory>>;
  deleteCategory(id: string, token: string): Promise<BaseResponse<boolean>>;
}

export class AdminCategoriesService implements IAdminCategoriesService {
  async getCategories(
    page = 1,
    limit = 10,
    token?: string,
  ): Promise<BaseResponse<PaginationResponse<AdminCategory>>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.categories)
      .addSearchParams({ page, limit })
      .build();
    return apiClient.get<PaginationResponse<AdminCategory>>(url, token);
  }

  async createCategory(input: CreateCategoryInput, token: string): Promise<BaseResponse<AdminCategory>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.categories)
      .build();
    return apiClient.post<CreateCategoryInput, AdminCategory>(url, input, token);
  }

  async updateCategory(id: string, input: UpdateCategoryInput, token: string): Promise<BaseResponse<AdminCategory>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.categories)
      .addParam(id)
      .build();
    return apiClient.patch<UpdateCategoryInput, AdminCategory>(url, input, token);
  }

  async deleteCategory(id: string, token: string): Promise<BaseResponse<boolean>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.categories)
      .addParam(id)
      .build();
    return apiClient.delete<boolean>(url, token);
  }
}

export const adminCategoriesService = new AdminCategoriesService();
