
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

export class URLBuilder {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || serverURL;
  }

  addPath(path: string): URLBuilder {
    this.baseURL = this.baseURL + `/${path.replace(/^\/|\/$/g, "")}`;
    return this;
  }
  addParam(path: string): URLBuilder {
    this.baseURL = this.baseURL + `/${path.replace(/^\/|\/$/g, "")}`;
    return this;
  }
  addSearchParams(
    params: Record<string, string | number | boolean>,
  ): URLBuilder {
    if (Object.keys(params).length === 0) {
      return this;
    }

    const searchParams = new URLSearchParams();
    for (const key in params) {
      searchParams.append(key, String(params[key]));
    }
    this.baseURL = `${this.baseURL}?${searchParams.toString()}`;
    return this;
  }

  build(): string {
    return this.baseURL;
  }
}
