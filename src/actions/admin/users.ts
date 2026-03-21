"use server";

import { getCookies, tokenType } from "@/features/shared/lib/cookie";
import { apiClient } from "@/features/shared/api/client";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { BaseResponse, PaginationResponse } from "@/types/global.types";
import type { User, CreateUserInput, UpdateUserInput } from "@/features/admin/types/user";

async function getToken(): Promise<string> {
  const token = await getCookies(tokenType.accessToken);
  if (!token) {
    throw new Error("Unauthorized");
  }
  return token;
}

export async function getAdminUsers(
  page: number = 1,
  limit: number = 10,
): Promise<BaseResponse<PaginationResponse<User>>> {
  const token = await getToken();
  const url = new URLBuilder()
    .addPath(API_ENDPOINTS.admin.users as any)
    .addSearchParams({ page, limit })
    .build();
  return apiClient.get<PaginationResponse<User>>(url, token);
}

export async function getAdminUserById(id: string): Promise<BaseResponse<User>> {
  const token = await getToken();
  const url = new URLBuilder()
    .addPath(API_ENDPOINTS.admin.users as any)
    .addParam(id)
    .build();
  return apiClient.get<User>(url, token);
}

export async function createAdminUser(
  input: CreateUserInput,
): Promise<BaseResponse<User>> {
  const token = await getToken();
  const url = new URLBuilder()
    .addPath(API_ENDPOINTS.admin.users as any)
    .build();
  return apiClient.post<CreateUserInput, User>(url, input, token);
}

export async function updateAdminUser(
  id: string,
  input: UpdateUserInput,
): Promise<BaseResponse<User>> {
  const token = await getToken();
  const url = new URLBuilder()
    .addPath(API_ENDPOINTS.admin.users as any)
    .addParam(id)
    .build();
  return apiClient.patch<UpdateUserInput, User>(url, input, token);
}

export async function deleteAdminUser(id: string): Promise<BaseResponse<void>> {
  const token = await getToken();
  const url = new URLBuilder()
    .addPath(API_ENDPOINTS.admin.users as any)
    .addParam(id)
    .build();
  return apiClient.delete<void>(url, token);
}
