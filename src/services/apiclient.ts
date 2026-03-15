export class APIClient {
  private buildHeaders(token?: string, extra?: HeadersInit): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(extra as Record<string, string>),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  async executeRequest<Response>(
    url: string,
    token?: string,
    options?: RequestInit,
  ): Promise<Response> {
    return fetch(`${url}`, {
      ...options,
      headers: this.buildHeaders(token, options?.headers),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json() as Promise<Response>;
      })
      .catch((error) => {
        console.error("API request failed:", error);
        throw error;
      });
  }

  async get<Response>(
    url: string,
    token?: string,
    options?: RequestInit,
  ): Promise<Response> {
    return await this.executeRequest<Response>(url, token, {
      ...options,
      method: "GET",
    });
  }

  async post<RequestBody, Response>(
    url: string,
    body: RequestBody,
    token?: string,
    options?: RequestInit,
  ): Promise<Response> {
    return await this.executeRequest<Response>(url, token, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<Response>(
    url: string,
    body: unknown,
    token?: string,
    options?: RequestInit,
  ): Promise<Response> {
    return await this.executeRequest<Response>(url, token, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async delete<Response>(
    url: string,
    token?: string,
    options?: RequestInit,
  ): Promise<Response> {
    return await this.executeRequest<Response>(url, token, {
      ...options,
      method: "DELETE",
    });
  }
}
export const apiClient = new APIClient();
