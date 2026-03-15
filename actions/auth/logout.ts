"use server";

import { deleteCookies, tokenType } from "@/lib/cookie";
import { redirect } from "next/navigation";

/**
 * Server action to handle user logout by clearing the authentication cookies
 * and redirecting the user to the login page.
 */
export async function logout() {
  try {
    // Delete the access token from cookies
    await deleteCookies(tokenType.accessToken);
  } catch (error) {
    console.error("Error during logout:", error);
  }

  // Redirect to login page after clearing session
  redirect("/login");
}