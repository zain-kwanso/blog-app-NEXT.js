import { createSession } from "@/lib/session";
import { signinService, signupService } from "@/services/authService";
import { sendVerificationEmail } from "@/services/emailService";

export const signinResolver = async (
  _parent: unknown,
  { email, password }: { email: string; password: string }
) => {
  try {
    const { isVerified, user } = await signinService(email, password);

    if (!isVerified) {
      return {
        success: false,
        message: "Please verify your email first.",
        status: 401,
      };
    }

    await createSession(user.id);

    return {
      success: true,
      message: "Signin successful.",
      status: 200,
      user,
    };
  } catch (error) {
    console.error("Signin error:", error);
    return {
      success: false,
      message: "Invalid credentials.",
      status: 400,
    };
  }
};

export const signupResolver = async (
  _parent: unknown,
  { email, name, password }: { email: string; name: string; password: string }
) => {
  try {
    const verificationToken = await signupService({ email, name, password });

    if (!verificationToken) {
    }

    const verificationUrl = `${process.env.NEXT_PUBLIC_URL}/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(email, verificationUrl);

    return {
      success: true,
      message:
        "Signup successful! Please check your email to verify your account.",
      status: 200,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Signup error:", error);
      if (error.message === "user already exists") {
        return {
          success: false,
          message: "User already exists.",
          status: 409,
        };
      } else {
        return {
          success: false,
          message: "An error occurred. Please try again later.",
          status: 500,
        };
      }
    }
  }
};
