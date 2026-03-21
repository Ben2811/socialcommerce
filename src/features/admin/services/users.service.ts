import type { User, UsersResponse, CreateUserInput, UpdateUserInput } from "../types/user";
import { BaseResponse, PaginationResponse } from "@/types/global.types";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import { apiClient } from "@/features/shared/api/client";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";

interface IUsersService {
  getUsers(page?: number, limit?: number): Promise<BaseResponse<PaginationResponse<User>>>;
  getUserById(id: string): Promise<BaseResponse<User>>;
  createUser(input: CreateUserInput): Promise<BaseResponse<User>>;
  updateUser(id: string, input: UpdateUserInput): Promise<BaseResponse<User>>;
  deleteUser(id: string): Promise<BaseResponse<void>>;
}

export class UsersAdminService implements IUsersService {
  async getUsers(page: number = 1, limit: number = 10): Promise<BaseResponse<PaginationResponse<User>>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.users as any)
      .addSearchParams({ page, limit })
      .build();

    return apiClient.get<PaginationResponse<User>>(url);
  }

  async getUserById(id: string): Promise<BaseResponse<User>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.users as any)
      .addParam(id)
      .build();

    return apiClient.get<User>(url);
  }

  async createUser(input: CreateUserInput): Promise<BaseResponse<User>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.users as any)
      .build();

    return apiClient.post<CreateUserInput, User>(url, input);
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<BaseResponse<User>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.users as any)
      .addParam(id)
      .build();

    return apiClient.patch<UpdateUserInput, User>(url, input);
  }

  async deleteUser(id: string): Promise<BaseResponse<void>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.users as any)
      .addParam(id)
      .build();

    return apiClient.delete<void>(url);
  }
}

export const usersAdminService = new UsersAdminService();
