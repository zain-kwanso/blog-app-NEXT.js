"use server";

import { createSession, deleteSession } from "@/app/lib/session";
import { signinService } from "@/services/authService";
import { signupService } from "@/services/authService";
import { sendVerificationEmail } from "@/services/emailService";
import { validateRequest } from "@/middleware/validateRequest";
import { signupValidationSchema } from "@/validation/validationSchema";
import { generatePresignedUrl } from "@/services/s3Service";
import User from "@/database/models/user.model";
import { verifySession } from "../lib/dal";

export async function logout() {
  await deleteSession();
}

export async function signinAction(email: string, password: string) {
  try {
    const { isVerified, user } = await signinService(email, password);

    if (!isVerified) {
      return { error: "Please verify your email first" };
    }

    const token = createSession(user.id);

    return { token, success: true, id: user.id };
  } catch (error) {
    console.error("Signin error:", error);
    return { error: "Something went wrong, please try again later." };
  }
}

export async function signupAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;

    // // Validate request
    // const { isValid, errors } = await validateRequest({ email, name, password }, signupValidationSchema);
    // if (!isValid) {
    //   return { errors, status: 400 };
    // }

    const verificationToken = await signupService({ email, name, password });
    const verificationUrl = `${process.env.NEXT_PUBLIC_URL}/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(email, verificationUrl);

    return {
      message: "Signup successful! Please check your email.",
      status: 200,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "user already exists") {
        return { error: "User already exists", status: 409 };
      }
      return {
        error: "Something went wrong. Please try again later.",
        status: 500,
      };
    }
  }
}

export const getUserAction = async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const { userId: id } = session;
    const user = await User.findByPk(id, {
      attributes: ["id", "name", "isAdmin", "profileKey"],
    });

    if (!user) {
      return null;
    }
    let profilePictureUrl = "";
    if (user?.profileKey) {
      profilePictureUrl = await generatePresignedUrl(user.profileKey);
    }

    const userData = user.toJSON();

    return {
      ...userData,
      profilePictureUrl,
    };
  } catch (error) {
    console.log("Failed to fetch user");
    return null;
  }
};
