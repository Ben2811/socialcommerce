"use server";

import { getCookies, tokenType } from "@/features/shared/lib/cookie";

export async function getAuthToken(): Promise<string | null> {
  return getCookies(tokenType.accessToken);
}