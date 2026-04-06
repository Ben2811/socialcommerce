import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { tokenType } from "@/features/shared/lib/cookie";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SELLER = "seller",
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
  }

  if (pathname.startsWith("/seller")) {
    return [UserRole.ADMIN, UserRole.SELLER].includes(userRole);
  }

  if (pathname.startsWith("/profile")) {
    return [UserRole.USER, UserRole.ADMIN, UserRole.SELLER].includes(userRole);
  }

  return true;
}

function getRedirectUrl(userRole: UserRole): string {
  switch (userRole) {
    case UserRole.ADMIN:
      return "/admin";
    case UserRole.SELLER:
      return "/seller";
    default:
      return "/profile";
  }
}

function verifyToken(token: string): JWTPayload | null {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not configured");
      return null;
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    if (!decoded?.sub || !decoded?.role) {
      console.warn("Invalid token payload: missing sub or role");
      return null;
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.warn("Token expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.warn("Invalid token:", error.message);
    } else {
      console.error("Unexpected error verifying token:", error);
    }
    return null;
  }
}

export function proxy(request: NextRequest) {
  const pathname = new URL(request.url).pathname;
  const token = request.cookies.get(tokenType.accessToken)?.value;

  const decoded = token ? verifyToken(token) : null;

  if (decoded) {
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      return NextResponse.redirect(
        new URL(getRedirectUrl(decoded.role), request.url),
      );
    }

    if (!checkRolePermission(pathname, decoded.role)) {
      return NextResponse.redirect(
        new URL(getRedirectUrl(decoded.role), request.url),
      );
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
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login/:path*",
    "/register/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/seller/:path*",
  ],
};
