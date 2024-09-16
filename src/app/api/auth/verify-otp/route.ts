import { verifyOTP } from "@/services/authService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    const token = await verifyOTP(email, otp);

    if (!token) {
      return NextResponse.json(
        { error: "Invalid OTP or expired" },
        { status: 403 }
      );
    }

    return NextResponse.json({ token }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Something Went Wrong Please Try Again Later" },
      { status: 500 }
    );
  }
}
