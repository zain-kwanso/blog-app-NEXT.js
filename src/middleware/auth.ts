import { NextRequest, NextResponse } from "next/server";
import { getProfileFromToken } from "../services/authService";
import { VerifyTokenResult } from "../../@types/module";

export const verifyToken = async (
  req: NextRequest
): Promise<VerifyTokenResult> => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Token not provided", isValid: false };
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = await getProfileFromToken(token);
    return { user, isValid: true };
  } catch (error) {
    return { error: "Invalid token", isValid: false };
  }
};
