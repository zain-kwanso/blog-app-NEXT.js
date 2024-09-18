import { UserResponse } from "./user";

export interface AuthContextType {
  user?: UserResponse | null;
  email?: string | null;
  loading: boolean;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  signin: (email: string, password: string) => Promise<boolean>;
  signout: () => void;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
}
