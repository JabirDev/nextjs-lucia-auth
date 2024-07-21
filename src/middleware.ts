import { NextRequest, NextResponse } from "next/server";
import { apiAuthPrefix, authRoutes, publicRoutes } from "./routes";

export async function middleware(req: NextRequest) {
  const session = req.cookies.get("auth_session");

  const isApiAuth = req.nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(req.nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

  console.log("session:", session);
  console.log("route:", req.nextUrl.pathname);

  if (isApiAuth) {
    return;
  }

  if (isAuthRoute) {
    if (session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return;
  }

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
