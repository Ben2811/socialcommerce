import { z } from "zod";

// Added 07 prefix and '$' to ensure the string ends after 10 digits
const vnPhoneRegex = /^(03|05|07|08|09)\d{8}$/;

export const registerSchema = z
  .object({
    email: z.email("Invalid email address"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    address: z.string().min(1, "Address is required"),
    phonenumber: z.string().regex(vnPhoneRegex, "Invalid phone number format"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match", // Changed from 'error' to 'message'
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
