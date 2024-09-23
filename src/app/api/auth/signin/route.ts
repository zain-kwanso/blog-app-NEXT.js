// src/app/api/auth/signin/route.ts
import { signinService } from "@/services/authService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const { token, isVerified } = await signinService(email, password);

    if (!isVerified) {
      return NextResponse.json(
        { message: "Please verify your email first" },
        { status: 401 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 403 }
      );
    }

    return NextResponse.json({ token }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json(
        { error: "Something went wrong. Please try again later." },
        { status: 500 }
      );
    } else {
      console.error("An unknown error occurred");
      return NextResponse.json(
        { error: "Something went wrong. Please try again later." },
        { status: 500 }
      );
    }
  }
}
