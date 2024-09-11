// import { data } from "../squelize";

import { Payload } from "./module";

export interface UserLoginAttributes {
  email: string;
  password: string;
}
export interface UserCreationAttributes extends UserLoginAttributes {
  name: string;
}

export interface UserType {
  email: string;
  password: string;
  name: string;
  id: number;
  isAdmin: boolean;
}

export interface UserResponse {
  user: Payload | null;
}

export type UserInstanceType = data<User, UserCreationAttributes>;
