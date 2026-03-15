import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import { apiClient } from "@/features/shared/api/client";
import { User } from "@/interfaces/user.interface";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";

export interface IUserService {
  getCurrentUser(accessToken: string): Promise<User>;
}

export class UserService implements IUserService {
  async getCurrentUser(accessToken: string): Promise<User> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.users)
      .addParam("current")
      .build();
    const response = await apiClient.get<User>(url, accessToken);
    return response;
  }
}
export const userService = new UserService();
