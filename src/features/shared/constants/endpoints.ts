export const API_ENDPOINTS = {
  auth: "/api/auth",
  users: "/api/users",
  products: "/api/products",
  categories: "/api/categories"
} as const;

export type Endpoints = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
