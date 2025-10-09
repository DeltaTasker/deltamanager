import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/modules/auth/server/auth";

const protectedRoutes = [/^\/dashboard/, /^\/app\/(?!auth)/, /^\/api\/(?!auth)/];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!protectedRoutes.some((pattern) => pattern.test(pathname))) {
    return NextResponse.next();
  }

  const session = await auth();
  if (!session?.user?.id) {
    const signInUrl = new URL("/access", request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/app/:path*"],
};

