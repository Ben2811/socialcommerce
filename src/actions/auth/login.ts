"use server";

import { setCookies } from "@/features/shared/lib/cookie";
import { authService } from "@/features/auth/services/auth.service";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const response = await authService.login(email, password);

  if (!response.success || !response.data) {
    throw new Error(response.message || "Login failed");
  }

  await setCookies("accessToken", response.data.accessToken);
  redirect("/");
}
