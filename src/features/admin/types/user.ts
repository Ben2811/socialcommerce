import { z } from "zod";
import type { UserRole, User } from "@/features/shared/types/user";

export type { UserRole, User };

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

// Form schemas — all concrete types (no optionals) for TanStack Form compatibility
export const createUserFormSchema = z.object({
  username: z.string().min(1, "Tên người dùng không được để trống"),
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  phonenumber: z.string(),
  address: z.string(),
});

export const updateUserFormSchema = z.object({
  username: z.string().min(1, "Tên người dùng không được để trống"),
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  password: z.string(),
  phonenumber: z.string(),
  address: z.string(),
});

export type CreateUserFormData = z.infer<typeof createUserFormSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserFormSchema>;
