import { z } from "zod";
import type { User as SharedUser } from "@/features/shared/types/user";
import type { UserRole } from "@/features/shared/types/user";

export type User = SharedUser;
export type { UserRole };

export interface UpdateProfileInput {
  username?: string;
  email?: string;
  phonenumber?: string;
  address?: string;
  imageUrls?: string[];
}

export const profileSchema = z.object({
  username: z.string().min(2, "Tên người dùng phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phonenumber: z
    .string()
    .regex(/^(\+?\d{9,15})?$/, "Số điện thoại không hợp lệ")
    .optional()
    .or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});

// Form schema — all concrete types (no optionals) for TanStack Form compatibility
export const profileFormSchema = z.object({
  username: z.string().min(2, "Tên người dùng phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phonenumber: z.string().regex(/^(\+?\d{9,15})?$/, "Số điện thoại không hợp lệ"),
  address: z.string(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
