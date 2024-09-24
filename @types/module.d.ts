import { Dialect } from "sequelize";
import { UserType } from "./user";
import exp from "constants";
import { JwtPayload } from "jsonwebtoken";

export interface Payload {
  id: number;
  iat: number;
  exp: number;
}

export interface SessionPayload extends JwtPayload {
  userId: number;
  expiresAt: Date;
}

type VerifyTokenSuccess = {
  user: Partial<UserType>;
  isValid: true;
};

type VerifyTokenError = {
  error: string;
  isValid: false;
};

type VerifyTokenResult = VerifyTokenSuccess | VerifyTokenError;
