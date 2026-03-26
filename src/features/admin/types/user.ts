import { z } from "zod";

export type UserRole = "user" | "admin" | "seller";

export interface User {
  _id: string;
  username: string;
  email: string;
  phonenumber?: string;
  address?: string;
  role: UserRole;
}

export interface UsersResponse {
  data: {
    users: User[];
    total: number;
  };
}

export const createUserSchema = z.object({
  username: z.string().min(1, "Tên người dùng không được để trống"),
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const updateUserSchema = z.object({
  username: z.string().min(1, "Tên người dùng không được để trống"),
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  phonenumber: z.string().optional(),
  address: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
