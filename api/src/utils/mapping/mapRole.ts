import { Role as GraphQLRole } from "../../entities/user.entity";
import { Role as PrismaRole } from "@prisma/client";

export function mapRole(role: PrismaRole): GraphQLRole {
  switch (role) {
    case PrismaRole.SYSTEM_ADMIN:
      return GraphQLRole.SYSTEM_ADMIN;
    case PrismaRole.MANAGER:
      return GraphQLRole.MANAGER;
    case PrismaRole.GENERAL_EMPLOYEE:
      return GraphQLRole.GENERAL_EMPLOYEE;
  }
}
