import type { User, UsersResponse, CreateUserInput, UpdateUserInput } from "../types/user";
import { BaseResponse, PaginationResponse } from "@/types/global.types";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import { apiClient } from "@/features/shared/api/client";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";

interface IUsersService {
  getUsers(page?: number, limit?: number, token?: string): Promise<BaseResponse<PaginationResponse<User>>>;
  getUserById(id: string, token: string): Promise<BaseResponse<User>>;
  createUser(input: CreateUserInput, token: string): Promise<BaseResponse<User>>;
  updateUser(id: string, input: UpdateUserInput, token: string): Promise<BaseResponse<User>>;
  deleteUser(id: string, token: string): Promise<BaseResponse<void>>;
}

export class UsersAdminService implements IUsersService {
  async getUsers(page: number = 1, limit: number = 10, token?: string): Promise<BaseResponse<PaginationResponse<User>>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.users)
      .addSearchParams({ page, limit })
      .build();

    return apiClient.get<PaginationResponse<User>>(url, token);
  }

  async getUserById(id: string, token: string): Promise<BaseResponse<User>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.users)
      .addParam(id)
      .build();

    return apiClient.get<User>(url, token);
  }

  async createUser(input: CreateUserInput, token: string): Promise<BaseResponse<User>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.users)
      .build();

    return apiClient.post<CreateUserInput, User>(url, input, token);
  }

  async updateUser(id: string, input: UpdateUserInput, token: string): Promise<BaseResponse<User>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.users)
      .addParam(id)
      .build();

    return apiClient.patch<UpdateUserInput, User>(url, input, token);
  }

  async deleteUser(id: string, token: string): Promise<BaseResponse<void>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.admin.users)
      .addParam(id)
      .build();

    return apiClient.delete<void>(url, token);
  }
}

export const usersAdminService = new UsersAdminService();
