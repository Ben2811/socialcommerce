"use server";

import { getCookies, tokenType } from "@/features/shared/lib/cookie";
import { BaseResponse, PaginationResponse } from "@/types/global.types";
import type { User, CreateUserInput, UpdateUserInput } from "@/features/admin/types/user";
import { usersAdminService } from "@/features/admin/services/users.service";

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

export async function getAdminUsers(
  page: number = 1,
  limit: number = 10,
): Promise<BaseResponse<PaginationResponse<User>>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<PaginationResponse<User>>();
  return usersAdminService.getUsers(page, limit, token);
}

export async function getAdminUserById(id: string): Promise<BaseResponse<User>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<User>();
  return usersAdminService.getUserById(id, token);
}

export async function createAdminUser(
  input: CreateUserInput,
): Promise<BaseResponse<User>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<User>();
  return usersAdminService.createUser(input, token);
}

export async function updateAdminUser(
  id: string,
  input: UpdateUserInput,
): Promise<BaseResponse<User>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<User>();
  return usersAdminService.updateUser(id, input, token);
}

export async function deleteAdminUser(id: string): Promise<BaseResponse<void>> {
  const token = await getToken();
  if (!token) return unauthorizedResponse<void>();
  return usersAdminService.deleteUser(id, token);
}
