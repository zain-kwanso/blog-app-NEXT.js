import { NextRequest, NextResponse } from "next/server";
import { getUsersWithPostCount } from "@/services/userService";
import { getUserAction } from "@/app/actions/auth";

export async function GET(req: NextRequest) {
  const user = await getUserAction();
  if (!user?.isAdmin) {
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
