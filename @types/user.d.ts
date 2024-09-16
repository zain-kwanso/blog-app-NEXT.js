// import { data } from "../squelize";

import { Payload } from "./module";

export interface UserLoginAttributes {
  email: string;
  password: string;
}
export interface UserCreationAttributes extends UserLoginAttributes {
  name: string;
}

export interface User {
  id: number;
  name: string;
  isAdmin: boolean;
}
export interface UserType extends User {
  email: string;
  password: string;
  otp: string;
  otpExpiration: Date;
  isVerified: boolean;
}

export interface UserResponse {
  user: User | null;
}

export type UserInstanceType = data<UserType, UserCreationAttributes>;
