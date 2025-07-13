import {
  AdminPanelSettings,
  Business,
  CheckCircle,
  Email,
  MoreVert,
  People,
  PersonAdd,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AddSystemAdminDialog from "../components/AddSystemAdminDialog";
import { useQuery } from "@apollo/client";
import { GET_ADMIN_DASHBOARD_STATS } from "../graphql/queries/adminDashboardQueries";

const Admin = () => {

  const [isOpen, setIsOpen] = useState(false);

  const { data, loading, error } = useQuery(GET_ADMIN_DASHBOARD_STATS);

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p>Error fetching stats: {error.message}</p>;

  const { systemAdmins, users, companies } = data.getAdminDashboardStats;


  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        <AdminPanelSettings sx={{ mr: 1, verticalAlign: "middle" }} />
        System Administration
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Manage system administrators and global settings
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Stats Cards */}
        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
          }}
        >
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h6">System Admins</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {systemAdmins}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active system administrators
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
          }}
        >
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
                  <Business />
                </Avatar>
                <Box>
                  <Typography variant="h6">Total Companies</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {companies}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Registered companies
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
          }}
        >
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h6">Total Users</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {users}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All system users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Administrators Section */}
        <Grid size={12}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                System Administrators
              </Typography>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                sx={{ textTransform: "none" }}
                onClick={()=>{setIsOpen(true)}}
              >
                Create System Admin
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Manage system administrator accounts
            </Typography>

            <Divider sx={{ my: 2 }} />

            <List>
              <ListItem
                secondaryAction={
                  <IconButton edge="end">
                    <MoreVert />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <Email />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="admin@system.com"
                  secondary={
                    <Box
                      sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                    >
                      <Chip
                        icon={<CheckCircle fontSize="small" />}
                        label="Active"
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label="Profile Complete"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  }
                />
              </ListItem>
            </List>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Created: 1/1/2024
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {
        isOpen && (
          <AddSystemAdminDialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
          />
        )
      }
    </Box>
  );
};

export default Admin;
