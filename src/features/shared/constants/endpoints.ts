export const API_ENDPOINTS = {
  auth: "/api/auth",
  users: "/api/users",
  addresses: "/api/addresses",
  products: "/api/products",
  categories: "/api/categories",
  reviews: "/api/reviews",
  messages: "/api/messages",
  cart: "/api/cart",
  orders: "/api/orders",
  payments: "/api/payments",
  images: {
    upload: "/api/images/upload",
  },
  seller: {
    products: "/api/products/my",
    orders: "/api/orders/seller/my",
  },
  admin: {
    users: "/api/admin/users",
    products: "/api/admin/products",
    categories: "/api/admin/categories",
  },
} as const;

export type Endpoints = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];