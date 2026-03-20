"use server";

import { registerSchema } from "@/features/auth/schema/register";
import { authService } from "@/features/auth/services/auth.service";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());

  const validation = registerSchema.safeParse(rawData);

  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    return { success: false, errors };
  }

  const { email, username, password, address, phonenumber } = validation.data;

  const response = await authService.register({
    username,
    email,
    password,
    address,
    phonenumber,
  });

  if (!response.success) {
    return {
      success: false,
      message: response.message || "Registration failed",
    };
  }

  redirect("/login");
}