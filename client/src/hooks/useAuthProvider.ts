import { useState, useEffect } from "react";
import type { User } from "../types/graphql/User";
import { loginService, logoutService, meService } from "../services/auth.service";
import { client } from "../apollo/apolloClient";

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);


  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const loginData = await loginService(client, email, password);
      console.log("Login Data:", loginData);
      if (loginData.login.success) {
        const meData = await meService(client);
        setUser(meData.me.data);
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
    await logoutService(client);
    setUser(null);
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const meData = await meService(client);
        if (meData?.me?.user) {
          setUser(meData.me.user);
        }
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
    error,
  };
};
