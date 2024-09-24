import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
// import { tokenExpired } from "utils/token";

export async function middleware(request: NextRequest) {
  const refresh_token = cookies().get("session");

  const is_authenticated = !!refresh_token;

  if (!is_authenticated) {
    let redirect_path = new URL("/login", request.url);
    return NextResponse.redirect(redirect_path);
  }

  // Return: Next Response
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/posts/create",
    "/posts/[id]/edit",
    "/admin",
    // "/customers/:path*",
    // "/email-verify",
    // "/finance/:path*",
    // "/fleet/:path*",
    // "/settings/:path*",
    // "/shipments/:path*",
    // "/signup/complete-onboarding",
    // "/signup/splash",
    // "/signup/subscriptions",
    // "/subscriptions/:path*",
    // "/suppliers/:path*",
    // "/email-verify",
    // "/",
  ],
};
