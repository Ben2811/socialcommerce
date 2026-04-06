import { z } from "zod";

// Added 07 prefix and '$' to ensure the string ends after 10 digits
const vnPhoneRegex = /^(03|05|07|08|09)\d{8}$/;

export const registerSchema = z
  .object({
    email: z.email("Địa chỉ email không hợp lệ"),
    username: z.string().min(1, "Tên người dùng là bắt buộc"),
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z.string(),
    address: z.string().min(1, "Địa chỉ là bắt buộc"),
    phonenumber: z
      .string()
      .regex(vnPhoneRegex, "Định dạng số điện thoại không hợp lệ"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
