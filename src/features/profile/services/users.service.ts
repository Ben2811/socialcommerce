import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import { apiClient } from "@/features/shared/api/client";
import { User } from "../types/user.interface";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { BaseResponse } from "@/types/global.types";

export interface IUserService {
  getCurrentUser(accessToken: string): Promise<BaseResponse<User>>;
}

export class UserService implements IUserService {
  async getCurrentUser(accessToken: string): Promise<BaseResponse<User>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.users)
      .addParam("current")
      .build();
    return await apiClient.get<User>(url, accessToken);
  }
}

export const userService = new UserService();
