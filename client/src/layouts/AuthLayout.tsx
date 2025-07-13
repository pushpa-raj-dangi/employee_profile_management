import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BusinessIcon from "@mui/icons-material/Business";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import { Box, Card, CircularProgress } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import {
  AppProvider,
  type Navigation,
  type Session,
} from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { DemoProvider } from "@toolpad/core/internal";
import React, { useEffect, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRouterAdapter } from "../routes/useRouterAdapter";
import { SidebarFooterAccount } from "./SidebarFooterAccount";
import { ManageAccounts } from "@mui/icons-material";
import { Role } from "../utils/permissions";
import type {
  CustomNavigation,
  RoleBasedNavItem,
} from "../types/CustomNavigation";
import { useAuth } from "../hooks/useAuth";

const NAVIGATION: CustomNavigation = [
  { kind: "header", title: "Main Menu" },
  { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
  {
    segment: "admin",
    title: "System Admin",
    icon: <AdminPanelSettingsIcon />,
    visibleTo: [Role.SYSTEM_ADMIN],
  },
  {
    segment: "employees",
    title: "Employees",
    visibleTo: [Role.SYSTEM_ADMIN, Role.MANAGER],
    icon: <PeopleIcon />,
  },
  
  {
    segment: "companies",
    title: "Companies",
    icon: <BusinessIcon />,
    visibleTo: [Role.SYSTEM_ADMIN, Role.MANAGER],
  },
  {
    segment: "invitations",
    title: "Invitations",
    icon: <AssignmentIcon />,
    visibleTo: [Role.SYSTEM_ADMIN, Role.MANAGER],
  },
  { segment: "profile", title: "Profile", icon: <ManageAccounts /> },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

interface DemoProps {
  window?: () => Window;
}

export default function AuthLayout(props: DemoProps) {
  const { window } = props;
  const router = useRouterAdapter();
  const demoWindow = window !== undefined ? window() : undefined;
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [session, setSession] = React.useState<Session | null>(null);

  const authentication = useMemo(() => {
    return {
      signIn: () => {
        setSession({
          user: {
            id: user?.id || "",
            email: user?.email || "",
            name: user?.role || "",
            image: user?.profile?.profileImage || user?.email || "",

          },
        });
      },
      signOut: () => {
        logout();
        setSession(null);
        navigate("/login");
      },
    };
  }, [logout, navigate, user?.email, user?.id, user?.role,user?.profile?.profileImage]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setSession({
        user: {
          id: user.id,
          email: user.role,
          name: user.email,
          image: user.profile?.profileImage || user.email || "",
        },
      });
    }
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const filteredNavigation = NAVIGATION.filter((item) => {
    const roleItem = item as RoleBasedNavItem;
    if (roleItem.visibleTo) {
      return roleItem.visibleTo.includes(user?.role.toString() || "");
    }
    return true;
  });

  return (
    <DemoProvider window={demoWindow}>
      <AppProvider
        navigation={filteredNavigation as Navigation}
        router={router}
        theme={demoTheme}
        window={demoWindow}
        session={session}
        authentication={authentication}
        branding={{
          logo: <ApartmentIcon />,
          title: "Employee Management",
          homeUrl: "/dashboard",
        }}
      >
        <DashboardLayout
          slots={{
            sidebarFooter: SidebarFooterAccount,
          }}
        >
          <Card elevation={0} sx={{ px: 4, py: 3, overflowY: "auto" }}>
            <Outlet />
          </Card>
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}
