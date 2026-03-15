import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { tokenType } from "./lib/cookie";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(tokenType.accessToken)?.value;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default");
    if (decoded) {
      return NextResponse.next();
    }
  }
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: "/profile",
};
