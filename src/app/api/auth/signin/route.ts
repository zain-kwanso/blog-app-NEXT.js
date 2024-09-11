import { signinService } from "@/services/authService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const token = await signinService(email, password);
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
        { error: "Something Went Wrong Please Try Again Later" },
        { status: 500 }
      );
    } else {
      console.error("An unknown error occurred");
      return NextResponse.json(
        { error: "Something Went Wrong Please Try Again Later" },
        { status: 500 }
      );
    }
  }
}
