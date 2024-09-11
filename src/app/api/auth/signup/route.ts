import { signupService } from "@/services/authService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = await signupService(body);

    if (!token) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 403 }
      );
    }

    return NextResponse.json({ token }, { status: 200 });
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Something went wrong, please try again later" },
      { status: 500 }
    );
  }
}
