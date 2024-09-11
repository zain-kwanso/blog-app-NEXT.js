import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserCreationAttributes, UserType } from "../../@types/user";
import User from "@/database/models/user.model";
import { Payload } from "../../@types/module";

const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";

// Signup service
export const signupService = async (
  userData: UserCreationAttributes
): Promise<string | null> => {
  const { email, password, name } = userData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return null;
  }

  const newUser = await User.create({
    email,
    name,
    password,
  });

  const token = jwt.sign({ id: newUser?.id }, SECRET_KEY, {
    expiresIn: "24h",
  });

  return token;
};

// signin service
export const signinService = async (
  email: string,
  password: string
): Promise<string | null> => {
  const user = await User.scope("withPassword").findOne({
    where: {
      email: email,
    },
  });

  if (!user || !user.password) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }
  console.log("id: ", user?.id);
  const token = jwt.sign({ id: user?.id }, SECRET_KEY, {
    expiresIn: "24h",
  });
  const decoded = jwt.verify(token, SECRET_KEY);
  console.log(decoded);

  return token;
};

// get profile service
export const getProfileFromToken = async (
  token: string
): Promise<Partial<UserType>> => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
    console.log("decoded : ", decoded);

    const user = await User.findByPk(decoded?.id, {
      attributes: ["id", "name", "isAdmin"],
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
