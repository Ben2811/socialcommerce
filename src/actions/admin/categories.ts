"use server";

import { getCookies, tokenType } from "@/features/shared/lib/cookie";
import { BaseResponse, PaginationResponse } from "@/types/global.types";
import type {
  AdminCategory,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/features/admin/types/category";
import { adminCategoriesService } from "@/features/admin/services/categories.service";

async function getToken(): Promise<string | null> {
  return getCookies(tokenType.accessToken);
}

function unauthorizedResponse<T>(): BaseResponse<T> {
  return {
    success: false,
    data: null as T,
    message: "Bạn cần đăng nhập để thực hiện thao tác này",
  };
}

export async function getAdminCategories(
  page = 1,
  limit = 10,
): Promise<BaseResponse<PaginationResponse<AdminCategory>>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<PaginationResponse<AdminCategory>>();
  return adminCategoriesService.getCategories(page, limit, token);
}

export async function createAdminCategory(
  input: CreateCategoryInput,
): Promise<BaseResponse<AdminCategory>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<AdminCategory>();
  return adminCategoriesService.createCategory(input, token);
}

export async function updateAdminCategory(
  id: string,
  input: UpdateCategoryInput,
): Promise<BaseResponse<AdminCategory>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<AdminCategory>();
  return adminCategoriesService.updateCategory(id, input, token);
}

export async function deleteAdminCategory(
  id: string,
): Promise<BaseResponse<boolean>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<boolean>();
  return adminCategoriesService.deleteCategory(id, token);
}
