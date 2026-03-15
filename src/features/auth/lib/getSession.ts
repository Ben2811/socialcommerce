import { User } from "@/interfaces/user.interface";
import { getCookies, tokenType } from "@/features/shared/lib/cookie";
import { userService } from "@/features/profile/services/users.service";

export async function getSession(): Promise<User | null> {
  const accessToken = await getCookies(tokenType.accessToken);
  if (!accessToken) {
    return null;
  }
  try {
    const user = await userService.getCurrentUser(accessToken);
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error fetching user session:", error);
    return null;
  }
}
