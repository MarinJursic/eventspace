import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }
  // For all other routes: if the user is signed in but their account is incomplete, force redirect.
  if (token && !token.role) {
    if (!pathname.startsWith("/complete-profile")) {
      return NextResponse.redirect(new URL("/complete-profile", req.url));
    } else {
      return NextResponse.next();
    }
  }

  // If accessing the complete-profile page, ensure the user is signed in.
  if (pathname.startsWith("/complete-profile")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
