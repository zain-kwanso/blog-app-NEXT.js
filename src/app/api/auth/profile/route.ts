import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/middleware/auth";

export async function GET(req: NextRequest) {
  // Use the token verification middleware
  const tokenVerification = await verifyToken(req);

  if (!tokenVerification.isValid) {
    return NextResponse.json(
      { error: tokenVerification.error },
      { status: 403 }
    );
  }

  const { user } = tokenVerification; // Extract the user from the middleware result

  try {
    // Return user information as response
    return NextResponse.json(user, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const status =
      errorMessage === "Invalid token" || errorMessage === "User not found"
        ? 403
        : 500;
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
