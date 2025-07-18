import { useState, useEffect } from "react";
import { client } from "../apollo/apolloClient";
import { loginService, meService, logoutService } from "../services/auth.service";
import type { User } from "../types/graphql/User";

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const loginData = await loginService(client, email, password);
      
      if (!loginData?.login?.success) {
        throw new Error(loginData?.login?.message || "Login failed");
      }

      // Get user data after successful login
      const meData = await meService(client).catch(err => {
        throw new Error(`Failed to fetch user data: ${err.message}`);
      });

      if (!meData?.me?.data) {
        throw new Error("User data not available");
      }

      setUser(meData.me.data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Login failed"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutService(client);
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    const checkUser = async () => {
      try {
        const meData = await meService(client);
        if (isMounted && meData?.me?.user) {
          setUser(meData.me.user);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkUser();

    return () => {
      isMounted = false;
    };
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