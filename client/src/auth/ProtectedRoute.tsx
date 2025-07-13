import { Navigate, useLocation } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import type { JSX } from "react";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({
  children,
  roles,
}: {
  children: JSX.Element;
  roles?: string[];
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user!.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};
