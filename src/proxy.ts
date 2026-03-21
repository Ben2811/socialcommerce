import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { tokenType } from "@/features/shared/lib/cookie";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

interface JWTPayload {
  sub: string;
  username: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

function checkRolePermission(pathname: string, userRole: UserRole): boolean {
  if (pathname.startsWith("/admin")) {
    return userRole === UserRole.ADMIN;
  }  if (pathname.startsWith("/profile")) {
    return [UserRole.USER, UserRole.ADMIN].includes(userRole);
  }  return true;
}

export function proxy(request: NextRequest) {
  const pathname = new URL(request.url).pathname;
  const token = request.cookies.get(tokenType.accessToken)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default"
    ) as JWTPayload;

    if (!decoded || !decoded.role) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (!checkRolePermission(pathname, decoded.role)) {
      if (decoded.role === UserRole.ADMIN) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/profile", request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", decoded.sub);
    requestHeaders.set("x-user-role", decoded.role);
    requestHeaders.set("x-username", decoded.username);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/profile/:path*", "/admin/:path*"],
};
