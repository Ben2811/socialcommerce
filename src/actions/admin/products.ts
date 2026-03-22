"use server";

import { getCookies, tokenType } from "@/features/shared/lib/cookie";
import { apiClient } from "@/features/shared/api/client";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { BaseResponse, PaginationResponse } from "@/types/global.types";
import type {
  AdminProduct,
  UpdateAdminProductStatusInput,
} from "@/features/admin/types/product";

async function getToken(): Promise<string> {
  const token = await getCookies(tokenType.accessToken);
  if (!token) throw new Error("Unauthorized");
  return token;
}

export async function getAdminProducts(
  page = 1,
  limit = 10,
): Promise<BaseResponse<PaginationResponse<AdminProduct>>> {
  const token = await getToken();
  const url = new URLBuilder()
    .addPath(API_ENDPOINTS.admin.products as any)
    .addSearchParams({ page, limit })
    .build();
  return apiClient.get<PaginationResponse<AdminProduct>>(url, token);
}

export async function updateAdminProductStatus(
  id: string,
  input: UpdateAdminProductStatusInput,
): Promise<BaseResponse<AdminProduct>> {
  const token = await getToken();
  const url = new URLBuilder()
    .addPath(API_ENDPOINTS.admin.products as any)
    .addParam(id)
    .addParam("status")
    .build();
  return apiClient.patch<UpdateAdminProductStatusInput, AdminProduct>(
    url,
    input,
    token,
  );
}

export async function deleteAdminProduct(
  id: string,
): Promise<BaseResponse<boolean>> {
  const token = await getToken();
  const url = new URLBuilder()
    .addPath(API_ENDPOINTS.admin.products as any)
    .addParam(id)
    .build();
  return apiClient.delete<boolean>(url, token);
}
