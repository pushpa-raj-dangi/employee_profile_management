
import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export const GuestRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};
