import { UserResponse } from "./user";

export interface AuthContextType {
  user?: UserResponse | null;
  email?: string | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<number>;
  signout: () => void;
  updateProfilePicture: (url: string) => void;
}
