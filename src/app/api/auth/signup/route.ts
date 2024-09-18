import { validateRequest } from "@/middleware/validateRequest";
import { signupService } from "@/services/authService";
import { signupValidationSchema } from "@/validation/validationSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { isValid, body, errors } = await validateRequest(
      req,
      signupValidationSchema
    );
    if (!isValid) {
      return NextResponse.json({ errors }, { status: 400 });
    }
    const success = await signupService(body);

    if (!success) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success }, { status: 200 });
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Something went wrong, please try again later" },
      { status: 500 }
    );
  }
}
