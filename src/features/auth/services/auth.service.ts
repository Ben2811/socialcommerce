import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import { BaseResponse } from "@/types/global.types";
import { apiClient } from "@/features/shared/api/client";

type TokenResponse = {
  accessToken: string;
};

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  address: string;
  phonenumber: string;
}

interface IAuthService {
  login(email: string, password: string): Promise<BaseResponse<TokenResponse>>;
  register(payload: RegisterPayload): Promise<BaseResponse<null>>;
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
    return apiClient.post<{ email: string; password: string }, TokenResponse>(
      url,
      { email, password },
    );
  }

  async register(payload: RegisterPayload): Promise<BaseResponse<null>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.auth)
      .addParam("register")
      .build();
    return apiClient.post<RegisterPayload, null>(url, payload);
  }
}

export const authService = new AuthService();