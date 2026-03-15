export const API_ENDPOINTS = {
  auth: "/api/auth",
  users: "/api/users",
  products: "/api/products",
} as const;

export type Endpoints = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
