export const userRole = {
  ADMIN: "admin",
  USER: "user",
  SELLER: "seller",
} as const;

export type UserRole = (typeof userRole)[keyof typeof userRole];

export interface User {
  _id: string;
  username: string;
  email: string;
  address?: string;
  phonenumber?: string;
  role: UserRole;
  imageUrls?: string[];
}
