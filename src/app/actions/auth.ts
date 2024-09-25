"use server";

import { createSession, deleteSession } from "@/app/lib/session";
import { signinService } from "@/services/authService";
import { signupService } from "@/services/authService";
import { sendVerificationEmail } from "@/services/emailService";
import {
  loginValidationSchema,
  signupValidationSchema,
} from "@/validation/validationSchema";
import { generatePresignedUrl } from "@/services/s3Service";
import User from "@/database/models/user.model";
import { verifySession } from "../lib/dal";
import { UserResponse } from "../../../@types/user";
import { validateFormData } from "@/validation/validateData";

export const logout = async () => {
  await deleteSession();
};

export const signinAction = async (formData: FormData) => {
  try {
    const validationResponse = await validateFormData(
      loginValidationSchema,
      formData
    );

    if (!validationResponse.isValid) {
      return { errors: validationResponse.errors, status: 400 };
    }

    const { email, password } = validationResponse.body;

    const { isVerified, user } = await signinService(email, password);

    if (!isVerified) {
      return { error: "Please verify your email first", status: 401 };
    }

    await createSession(user.id);

    return { success: "Signin Successfull", status: 200 };
  } catch (error) {
    console.error("Signin error:", error);
    return {
      error: "Something went wrong, please try again later.",
      status: 500,
    };
  }
};

export const signupAction = async (formData: FormData) => {
  try {
    const validationResponse = await validateFormData(
      signupValidationSchema,
      formData
    );

    if (!validationResponse.isValid) {
      return { errors: validationResponse.errors, status: 400 };
    }

    const { email, name, password } = validationResponse.body;

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
};

export const getUserAction = async (): Promise<UserResponse | null> => {
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
