import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/middleware/auth";

export async function GET(req: NextRequest) {
  const tokenVerification = await verifyToken(req);

  if (!tokenVerification.isValid) {
    return NextResponse.json(
      { error: tokenVerification.error },
      { status: 403 }
    );
  }

  const { user } = tokenVerification;
  try {
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
