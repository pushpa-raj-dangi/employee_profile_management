import { Authorized, Query, Resolver } from "type-graphql";
import {
  AdminDashboardStats,
  DashboardStats,
} from "../entities/dashboard.entity";
import { prisma } from "../config/prisma";
import { Role } from "../entities";
import { Service } from "typedi";

@Service()
@Resolver()
export class DashboardResolver {
  @Authorized([Role.SYSTEM_ADMIN, Role.MANAGER])
  @Query(() => DashboardStats)
  async getDashboardStats(): Promise<DashboardStats> {
    const [companies, employees, pendingInvitations, activeUsers] =
      await Promise.all([
        prisma.company.count(),
        prisma.user.count({
          where: {
            role: "GENERAL_EMPLOYEE",
          },
        }),
        prisma.invitation.count({
          where: {
            status: "PENDING",
          },
        }),
        prisma.user.count({
          where: {
            isActive: true,
          },
        }),
      ]);

    return {
      companies,
      employees,
      pendingInvitations,
      activeUsers,
    };
  }

  @Authorized([Role.SYSTEM_ADMIN])
  @Query(() => AdminDashboardStats)
  async getAdminDashboardStats(): Promise<AdminDashboardStats> {
    const [systemAdmins, users, companies] = await Promise.all([
      prisma.user.count({
        where: {
          role: "SYSTEM_ADMIN",
        },
      }),
      prisma.user.count(),
      prisma.company.count(),
    ]);

    return {
      systemAdmins,
      users,
      companies,
    };
  }
}
