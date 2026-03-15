import { API_ENDPOINTS } from "@/lib/shared/constants/endpoints";
import { URLBuilder } from "@/lib/urlbuilder";
import { BaseResponse } from "@/types/global.types";
import { apiClient } from "./apiclient";

type TokenResponse = {
  accessToken: string;
};

interface IAuthService {
  login(email: string, password: string): Promise<BaseResponse<TokenResponse>>;
  register(
    username: string,
    email: string,
    password: string,
  ): Promise<BaseResponse<null>>;
}

class AuthService implements IAuthService {
  async login(
    email: string,
    password: string,
  ): Promise<BaseResponse<TokenResponse>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.auth)
      .addParam("login")
      .build();
    return apiClient.post<
      { email: string; password: string },
      BaseResponse<TokenResponse>
    >(url, { email, password });
  }
  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<BaseResponse<null>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.auth)
      .addParam("register")
      .build();
    return apiClient.post<
      { username: string; email: string; password: string },
      BaseResponse<null>
    >(url, { username, email, password });
  }
}
export const authService = new AuthService();
