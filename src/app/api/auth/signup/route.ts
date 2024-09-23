import { validateRequest } from "@/middleware/validateRequest";
import { signupService } from "@/services/authService";
import { sendVerificationEmail } from "@/services/emailService";
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

    const { email, name, password } = body;

    const verificationToken = await signupService({ email, name, password });
    const verificationUrl = `${process.env.NEXT_PUBLIC_URL}/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(email, verificationUrl);

    return NextResponse.json(
      {
        message:
          "Signup successful! Please check your email to verify your account.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      if (error.message === "user already exists") {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Something went wrong, please try again later." },
        { status: 500 }
      );
    } else {
      console.error("An unknown error occurred");
      return NextResponse.json(
        { error: "Something went wrong, please try again later." },
        { status: 500 }
      );
    }
  }
}
