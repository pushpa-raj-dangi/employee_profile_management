import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import AuthLayout from "../layouts/AuthLayout";
import Employee from "../pages/Employee";
import Admin from "../pages/Admin";
import Company from "../pages/Company";
import Invitation from "../pages/Invitation";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { GuestRoute } from "../auth/GuestRoute";
import Profile from "../pages/Profile";
import { Role } from "../utils/permissions";
import CompanyDetails from "../pages/CompanyDetails";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <Register />
      </GuestRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <AuthLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "employees",
        element: (
          <ProtectedRoute>
            <Employee />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute roles={[Role.SYSTEM_ADMIN]}>
            <Admin />
          </ProtectedRoute>
        ),
      },
      {
        path: "companies",
        element: (
          <ProtectedRoute roles={[Role.SYSTEM_ADMIN, Role.MANAGER]}>
            <Company />
          </ProtectedRoute>
        ),
      },
      {
        path: "invitations",
        element: (
          <ProtectedRoute roles={[Role.SYSTEM_ADMIN, Role.MANAGER]}>
            <Invitation />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/:id",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "companies/:companyId",
        element: (
          <ProtectedRoute>
            <CompanyDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Dashboard />,
      },
    ],
  },
]);

export default router;
