import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import { apiClient } from "@/features/shared/api/client";
import { User, UpdateProfileInput } from "../types/user.interface";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { BaseResponse } from "@/types/global.types";

export interface IUserService {
  getUserById(id: string): Promise<BaseResponse<User>>;
  getCurrentUser(accessToken: string): Promise<BaseResponse<User>>;
  updateCurrentUser(input: UpdateProfileInput, accessToken: string): Promise<BaseResponse<User>>;
}

export class UserService implements IUserService {
  async getUserById(id: string): Promise<BaseResponse<User>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.users)
      .addPath(id)
      .build();

    return await apiClient.get<User>(url);
  }

  async getCurrentUser(accessToken: string): Promise<BaseResponse<User>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.users)
      .addParam("current")
      .build();
    return await apiClient.get<User>(url, accessToken);
  }

  async updateCurrentUser(
    input: UpdateProfileInput,
    accessToken: string,
  ): Promise<BaseResponse<User>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.users)
      .addParam("current")
      .build();
    return await apiClient.patch<UpdateProfileInput, User>(url, input, accessToken);
  }
}

export const userService = new UserService();
