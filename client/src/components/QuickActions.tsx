import {
  AddBusiness,
  Factory,
  ManageAccounts,
  ManageAccountsRounded,
  Person2Rounded,
  PersonAdd,
} from "@mui/icons-material";
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useAuth } from "../auth/AuthProvider";
import { hasPermission, RolePermissions } from "../utils/permissions";

const QuickActions = () => {
  const { user } = useAuth();
  const role = user?.role;
  console.log("QuickActions component rendered", user?.role);

  const quickActions = [
    {
      icon: <AddBusiness />,
      text: "Create new companies",
      permissionKey: "EDIT_COMPANY_INFO",
    },
    {
      icon: <PersonAdd />,
      text: "Invite users",
      permissionKey: "INVITE_USER",
    },
    {
      icon: <ManageAccountsRounded />,
      text: "Edit your profile",
      permissionKey: "EDIT_OWN_PROFILE",
    },
    {
      icon: <Person2Rounded />,
      text: "View all employee profiles",
      permissionKey: "VIEW_ALL_PROFILES",
    },
    {
      icon: <ManageAccounts />,
      text: "Manage all employee profiles",
      permissionKey: "MANAGE_ALL_PROFILES",
    },
    {
      icon: <Factory />,
      text: "View your company information",
      permissionKey: "VIEW_COMPANY_INFO",
    },
  ];

  const visibleActions = quickActions.filter((action) =>
    hasPermission(
      action.permissionKey as keyof typeof RolePermissions,
      role as keyof typeof RolePermissions
    )
  );

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Common tasks for your role
      </Typography>
      <Divider sx={{ my: 1 }} />
      <List>
        {visibleActions.map((action, index) => (
          <ListItem key={index}>
            <ListItemIcon>{action.icon}</ListItemIcon>
            <ListItemText primary={action.text} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default QuickActions;
