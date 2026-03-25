"use server";

import { getCookies, tokenType } from "@/features/shared/lib/cookie";
import { BaseResponse, PaginationResponse } from "@/types/global.types";
import type {
  AdminProduct,
  UpdateAdminProductStatusInput,
} from "@/features/admin/types/product";
import { adminProductsService } from "@/features/admin/services/products.service";

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

export async function getAdminProducts(
  page = 1,
  limit = 10,
): Promise<BaseResponse<PaginationResponse<AdminProduct>>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<PaginationResponse<AdminProduct>>();
  return adminProductsService.getProducts(page, limit, token);
}

export async function updateAdminProductStatus(
  id: string,
  input: UpdateAdminProductStatusInput,
): Promise<BaseResponse<AdminProduct>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<AdminProduct>();
  return adminProductsService.updateProductStatus(id, input, token);
}

export async function deleteAdminProduct(
  id: string,
): Promise<BaseResponse<boolean>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<boolean>();
  return adminProductsService.deleteProduct(id, token);
}
