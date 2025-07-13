import {
  Avatar,
  Box,
  Divider,
  Grid,
  Paper,
  Typography
} from "@mui/material";
import { useAuth } from "../auth/AuthProvider";
import DashboardStat from "../components/DashboardStat";
import QuickActions from "../components/QuickActions";
import { Role } from "../utils/permissions";

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={"bold"} component="h1">
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back, {user?.email}
        </Typography>
      </Box>

      {/* Stats Stats */}
      {
        user?.role === Role.SYSTEM_ADMIN || user?.role === Role.MANAGER ? (
          <DashboardStat/>
        ) : null
        
      }
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <QuickActions />
        </Grid>

        {/* System Information */}
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Information
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Your account details
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                {user?.email.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  {user?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.role}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ pl: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Role:</strong> {user?.role}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {user?.email}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
