import { gql } from "@apollo/client";

export const GET_ADMIN_DASHBOARD_STATS = gql`
  query GetAdminDashboardStats {
    getAdminDashboardStats {
      systemAdmins
      users
      companies
    }
  }
`;

export const GET_ALL_SYSTEM_ADMINS = gql`
  query GetAllSystemAdmins {
    getAllSystemAdmins {
      id
      email
      role
      createdAt
      updatedAt
      isActive
    }
  }
`;