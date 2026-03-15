import { URLBuilder } from "@/lib/urlbuilder";
import { apiClient } from "./apiclient";
import { User } from "@/interfaces/user.interface";
import { API_ENDPOINTS } from "@/lib/shared/constants/endpoints";

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
