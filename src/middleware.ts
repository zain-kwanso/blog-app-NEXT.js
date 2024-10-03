import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser } from "./actions/auth";

const publicNoSessionRoutes = ["/login", "/signup", "/verify-email"];
const privateSessionRoutes = ["/posts/create", "/admin"];
const publicRoutes = ["/", "/about"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const session = cookies().get("session")?.value;

  const isPublicNoSessionRoute = publicNoSessionRoutes.includes(path);

  const isPrivateSessionRoute =
    privateSessionRoutes.includes(path) ||
    (path.startsWith("/posts") && path.endsWith("/edit"));

  const isPublicRoute = publicRoutes.includes(path);

  if (isPublicNoSessionRoute && !!session) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isPrivateSessionRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
