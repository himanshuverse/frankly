import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // If user is logged in and tries to access an auth page,
  // redirect them to dashboard
  if (
    token &&
    (
      pathname.startsWith("/sign-in") ||
      pathname.startsWith("/sign-up") ||
      pathname.startsWith("/verify") ||
      pathname === "/"
    )
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is NOT logged in and tries to access dashboard,
  // redirect them to sign-in
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Otherwise, allow the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/sign-in/:path*",
    "/sign-up/:path*",
    "/dashboard/:path*",
    "/verify/:path*",
  ],
};