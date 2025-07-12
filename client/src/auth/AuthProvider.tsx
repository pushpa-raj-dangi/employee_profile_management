import React, { createContext, useContext, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION, LOGOUT_MUTATION, ME_MUTATION } from "../graphql/mutations/authMutations";
import type { User } from "../types/graphql/User";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [meMutation] = useMutation(ME_MUTATION);

  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await loginMutation({ variables: { email, password } });
      if (data.login.success) {
        const { data: meData } = await meMutation();
        console.log("Login response:", meData);
        setUser(meData.me.user);
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const { data } = await logoutMutation();
    console.log("Logout response:", data);
    setUser(null);
  };
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await meMutation();
        if (data?.me?.user) {
          setUser(data.me.user);
        }
      } catch  {
        // user not logged in
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [meMutation]);
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
