import { User } from "./user";

export interface AuthContextType {
  user?: User | null;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  signin: (email: string, password: string) => Promise<boolean>;
  signout: () => void;
}
