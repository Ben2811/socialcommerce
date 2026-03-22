"use server";

import { getCookies, tokenType } from "@/features/shared/lib/cookie";
import { apiClient } from "@/features/shared/api/client";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { BaseResponse, PaginationResponse } from "@/types/global.types";
import type {
  AdminCategory,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/features/admin/types/category";

async function getToken(): Promise<string> {
  const token = await getCookies(tokenType.accessToken);
  if (!token) throw new Error("Unauthorized");
  return token;
}

export async function getAdminCategories(
  page = 1,
  limit = 10,
): Promise<BaseResponse<PaginationResponse<AdminCategory>>> {
  const token = await getToken();
  const url = new URLBuilder()
    .addPath(API_ENDPOINTS.admin.categories as any)
    .addSearchParams({ page, limit })
    .build();
  return apiClient.get<PaginationResponse<AdminCategory>>(url, token);
}

export async function createAdminCategory(
  input: CreateCategoryInput,
): Promise<BaseResponse<AdminCategory>> {
  const token = await getToken();
  const url = new URLBuilder()
    .addPath(API_ENDPOINTS.admin.categories as any)
    .build();
  return apiClient.post<CreateCategoryInput, AdminCategory>(url, input, token);
}

export async function updateAdminCategory(
  id: string,
  input: UpdateCategoryInput,
): Promise<BaseResponse<AdminCategory>> {
  const token = await getToken();
  const url = new URLBuilder()
    .addPath(API_ENDPOINTS.admin.categories as any)
    .addParam(id)
    .build();
  return apiClient.patch<UpdateCategoryInput, AdminCategory>(url, input, token);
}

export async function deleteAdminCategory(
  id: string,
): Promise<BaseResponse<boolean>> {
  const token = await getToken();
  const url = new URLBuilder()
    .addPath(API_ENDPOINTS.admin.categories as any)
    .addParam(id)
    .build();
  return apiClient.delete<boolean>(url, token);
}
