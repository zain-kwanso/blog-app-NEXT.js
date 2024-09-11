import { Dialect } from "sequelize";
import { UserType } from "./user";

export interface Payload {
  id: number;
  iat: number;
  exp: number;
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
