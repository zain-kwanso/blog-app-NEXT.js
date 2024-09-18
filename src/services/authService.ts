import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserCreationAttributes, UserType } from "../../@types/user";
import User from "@/database/models/user.model";
import { generateOTP, sendOTPEmail } from "./otpService";
import { Op } from "sequelize";
import { generatePresignedUrl } from "./s3Service";

const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";

// Signup service
export const signupService = async (
  userData: UserCreationAttributes
): Promise<boolean> => {
  const { email, password, name } = userData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return false;
  }

  const newUser = await User.create({
    email,
    name,
    password,
  });

  return true;
};

// signin service
export const signinService = async (
  email: string,
  password: string
): Promise<boolean> => {
  const user = await User.scope("withPassword").findOne({
    where: {
      email: email,
    },
  });

  if (!user || !user.password) {
    return false;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return false;
  }

  return true;
};

// get profile service
export const getProfileFromToken = async (
  token: string
): Promise<Partial<UserType>> => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };

    const user = await User.findByPk(decoded?.id, {
      attributes: ["id", "name", "isAdmin", "profileKey"],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const profilePictureUrl = await generatePresignedUrl(user.profileKey);

    const userData = user.toJSON();

    return {
      ...userData,
      profilePictureUrl,
    };
  } catch (error) {
    throw new Error("Invalid token");
  }
};

//verify OTP service
export async function verifyOTP(
  email: string,
  otp: string
): Promise<string | null> {
  const user = await User.findOne({
    where: {
      email,
      otp,
      otpExpiration: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    return null;
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiration = null;
  await user.save();

  const token = jwt.sign({ id: user.id }, SECRET_KEY, {
    expiresIn: "24h",
  });

  return token;
}
