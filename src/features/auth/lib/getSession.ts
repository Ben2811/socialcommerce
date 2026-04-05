import { User } from "@/features/profile/types/user.interface";
import { getCookies, tokenType } from "@/features/shared/lib/cookie";
import { userService } from "@/features/profile/services/users.service";

export async function getSession(): Promise<User | null> {
  try {
    const accessToken = await getCookies(tokenType.accessToken);
    
    if (!accessToken) {
      return null;
    }

    const response = await userService.getCurrentUser(accessToken);
    
    if (!response.success || !response.data) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching user session:", error);
    return null;
  }
}
