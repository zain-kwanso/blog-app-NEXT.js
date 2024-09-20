import { verifyToken } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";
import { getUsersWithPostCount } from "@/services/userService";

export async function GET(req: NextRequest) {
  const tokenVerification = await verifyToken(req);
  if (!tokenVerification.isValid || !tokenVerification.user?.isAdmin) {
    return NextResponse.json(
      { error: "Access denied. Admins only." },
      { status: 403 }
    );
  }

  try {
    const users = await getUsersWithPostCount();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch user data." },
      { status: 500 }
    );
  }
}
