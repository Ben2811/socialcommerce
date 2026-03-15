"use server";

import { setCookies } from "@/lib/cookie";
import { authService } from "@/services/auth.service";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const result = await authService.login(email, password);
  if (!result.success) {
    throw new Error(result.message || "Login failed");
  }
  await setCookies("accessToken", result.data.accessToken);

  redirect("/");
}
