import { NextRequest, NextResponse } from "next/server";
import User from "@/database/models/user.model";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Invalid or missing token" },
      { status: 400 }
    );
  }

  try {
    const user = await User.findOne({
      where: {
        verificationToken: token,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 404 }
      );
    }

    await user.update({ isVerified: true, verificationToken: null });

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
