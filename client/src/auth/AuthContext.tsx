import { createContext } from "react";
import type { User } from "../types/graphql/User";
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  error: Error | null;
}
export const AuthContext = createContext<AuthContextType>(null!);