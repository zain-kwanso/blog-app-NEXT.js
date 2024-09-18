import { NextRequest, NextResponse } from "next/server";
import { generateOTP, sendOTPEmail } from "@/services/otpService";
import User from "@/database/models/user.model";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
   

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendOTPEmail(user.email, otp);

    return NextResponse.json({ message: "OTP sent" }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { error: "Something Went Wrong Please Try Again Later" },
      { status: 500 }
    );
  }
}
