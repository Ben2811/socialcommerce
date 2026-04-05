import { BaseResponse } from "@/types/global.types";
import { HTTP_METHOD } from "next/dist/server/web/http";

export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "APIError";
  }
}

export class APIClient {
  private buildHeaders(token?: string | null, extra?: HeadersInit): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(extra as Record<string, string>),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      const message =
        (errorData as Record<string, unknown>)?.message ||
        `HTTP error! status: ${response.status}`;

      throw new APIError(response.status, String(message), errorData);
    }

    return response.json() as Promise<T>;
  }

  private createErrorResponse<T>(error: unknown): BaseResponse<T> {
    if (error instanceof APIError) {
      return {
        success: false,
        data: null as unknown as T,
        message: error.message,
      };
    }
    return {
      success: false,
      data: null as unknown as T,
      message: "An unexpected error occurred",
    };
  }

  private async executeRequest<T>(
    url: string,
    method: HTTP_METHOD,
    token?: string | null,
    body?: unknown,
    options?: RequestInit,
  ): Promise<BaseResponse<T>> {
    try {
      const response = await fetch(url, {
        ...options,
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: this.buildHeaders(token, options?.headers),
      });

      const data = await this.handleResponse<BaseResponse<T>>(response);
      return data;
    } catch (error) { 
      console.error(`API ${method} request failed:`, error);
      return this.createErrorResponse<T>(error);
    }
  }

  async get<T>(
    url: string,
    token?: string | null,
    options?: RequestInit,
  ): Promise<BaseResponse<T>> {
    return this.executeRequest<T>(url, "GET", token, undefined, options);
  }

  async post<RequestBody, T>(
    url: string,
    body: RequestBody,
    token?: string | null,
    options?: RequestInit,
  ): Promise<BaseResponse<T>> {
    return this.executeRequest<T>(url, "POST", token, body, options);
  }

  async put<RequestBody, T>(
    url: string,
    body: RequestBody,
    token?: string | null,
    options?: RequestInit,
  ): Promise<BaseResponse<T>> {
    return this.executeRequest<T>(url, "PUT", token, body, options);
  }

  async patch<RequestBody, T>(
    url: string,
    body: RequestBody,
    token?: string | null,
    options?: RequestInit,
  ): Promise<BaseResponse<T>> {
    return this.executeRequest<T>(url, "PATCH", token, body, options);
  }

  async delete<T>(
    url: string,
    token?: string | null,
    options?: RequestInit,
  ): Promise<BaseResponse<T>> {
    return this.executeRequest<T>(url, "DELETE", token, undefined, options);
  }
}

export const apiClient = new APIClient();
