import { cookies } from "next/headers";

export const tokenType = {
  accessToken: "accessToken",
} as const;
export type TokenType = (typeof tokenType)[keyof typeof tokenType];

async function getCookies(type: TokenType) {
  const cookieStore = await cookies();
  const token = cookieStore.get(type);
  return token?.value || null;
}

async function setCookies(type: TokenType, value: string, expiresInDays = 7) {
  const expires = new Date();
  const maxAge = expiresInDays * 24 * 60 * 60;
  expires.setTime(expires.getTime() + maxAge * 1000);
  const cookieStore = await cookies();
  cookieStore.set({
    name: type,
    value,
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

async function deleteCookies(type: TokenType) {
  const cookieStore = await cookies();
  cookieStore.delete(type);
}

export { getCookies, setCookies, deleteCookies };
