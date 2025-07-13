import { useQuery } from "@apollo/client";
import { GET_DASHBOARD_STATS } from "../graphql/queries/dashboardQueries";
import { Grid } from "@mui/material";
import StatCard from "./StatCard";
import { AdminPanelSettings, Business, MailOutline, People } from "@mui/icons-material";

const DashboardStat = () => {
    
  const { loading, error, data } = useQuery(GET_DASHBOARD_STATS);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const stats = {
    companies: data.getDashboardStats.companies,
    employees: data.getDashboardStats.employees,
    pendingInvitations: data.getDashboardStats.pendingInvitations,
    activeUsers: data.getDashboardStats.activeUsers,
  };
  return (
    <>
    <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<Business color="primary" />}
            title="Companies"
            value={stats.companies}
            description="Total registered companies"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<People color="primary" />}
            title="Employees"
            value={stats.employees}
            description="Total employees"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<MailOutline color="primary" />}
            title="Pending Invitations"
            value={stats.pendingInvitations}
            description="Awaiting registration"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<AdminPanelSettings color="primary" />}
            title="Active Users"
            value={stats.activeUsers}
            description="System-wide"
          />
        </Grid>
      </Grid>

    </>
  )
}

export default DashboardStat