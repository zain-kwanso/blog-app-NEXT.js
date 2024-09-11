import { Payload } from "./module";

export interface AuthContextType {
  user?: Payload | null;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  signin: (email: string, password: string) => Promise<boolean>;
  signout: () => void;
}
