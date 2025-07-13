import { Prisma } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import { Service } from "typedi";
import { prisma } from "../config/prisma";
import { EmployeeDTO } from "../entities/DTOS/employees/employeeDto";
import { InvitationStatus } from "../entities/invitation.entity";
import { Role } from "../entities/user.entity";
import { ForbiddenError, NotFoundError, ValidationError } from "../errors";
import { ProfileInput } from "../inputs/profile.input";
import { RegisterInput } from "../inputs/register.input";
import { SendInvitationInput } from "../inputs/send-invitation.input";
import { generateToken, hashPassword } from "../utils/auth/auth";
import { sendEmail } from "../utils/email";

@Service()
export class UserService {
  async createUser(input: RegisterInput, role: Role) {
    return await prisma.$transaction(async (prisma) => {
      if (!input.email || !input.password) {
        throw new ValidationError("Email and password are required");
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new ValidationError("User with this email already exists");
      }

      const hashedPassword = await hashPassword(input.password);

      return prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          role,
        },
      });
    });
  }

  async updateProfile(userId: string, input: ProfileInput) {
    return await prisma.$transaction(async (prisma) => {
      if (!userId) {
        throw new AuthenticationError("User ID is required");
      }

      if (!input.firstName || !input.lastName) {
        throw new ValidationError("First name and last name are required");
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new NotFoundError("User not found");
      }

      const profile = await prisma.profile.findUnique({ where: { userId } });

      return prisma.user.update({
        where: { id: userId },
        data: {
          profile: profile ? { update: input } : { create: input },
        },
        include: { profile: true },
      });
    });
  }

  async sendInvitation(
    invitedById: string,
    inviterRole: Role,
    input: SendInvitationInput
  ) {
    return await prisma.$transaction(async (prisma) => {
      const { email, role, companyId } = input;
      console.log(
        "Inviting user:",
        invitedById,
        email,
        "Role:",
        role,
        "Company ID:",
        companyId
      );

      if (!email || !role || !companyId) {
        throw new ValidationError("Email, role and company ID are required");
      }

      if (inviterRole === Role.MANAGER) {
        const companyUser = await prisma.companyUser.findFirst({
          where: { companyId, userId: invitedById },
        });

        if (!companyUser) {
          throw new ForbiddenError(
            "You don't have permission to invite to this company"
          );
        }
      }

      const existingInvitation = await prisma.invitation.findFirst({
        where: {
          email,
          status: InvitationStatus.PENDING,
          expiresAt: { gt: new Date() },
        },
      });

      if (existingInvitation) {
        throw new ValidationError(
          "Pending invitation already exists for this email"
        );
      }

      const token = generateToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const tempPassword = generateToken().substring(0, 12);

      const invitation = await prisma.invitation.create({
        data: {
          email,
          role: role as Role,
          token,
          expiresAt,
          status: InvitationStatus.PENDING,
          invitedById,
          companyId,
          tempPassword: await hashPassword(tempPassword),
        },
      });

      console.log(`${process.env.FRONTEND_URL}/register?token=${token}`);
      try {
        await sendEmail({
          to: email,
          subject: "Invitation to Employee Management System",
          text: `
          
          You've been invited to join our system.
          Temporary password: ${tempPassword} 
          Click here: ${process.env.FRONTEND_URL}/register?token=${token}`,
        });
      } catch (e) {
        console.error("Failed to send email", e);
        throw new Error("Failed to send invitation email");
      }

      return invitation;
    });
  }

  // async listEmployees(
  //   userId: string,
  //   userRole: GraphQLRole
  // ): Promise<GraphQLUser[]> {
  //   if (!userId) throw new AuthenticationError("User ID is required");

  //   let prismaUsers: PrismaUserWithProfile[] = [];

  //   if (userRole === GraphQLRole.SYSTEM_ADMIN) {
  //     prismaUsers = await prisma.user.findMany({ include: { profile: true, companies: true } });
  //   } else {
  //     const companyUsers = await prisma.companyUser.findMany({
  //       where: { userId },
  //       select: { companyId: true },
  //     });

  //     const companyIds = companyUsers.map((cu) => cu.companyId);

  //     if (!companyIds.length) return [];

  //     prismaUsers = await prisma.user.findMany({
  //       where: {
  //         companies: {
  //           some: { companyId: { in: companyIds } },
  //         },
  //       },
  //       include: { profile: true },
  //     });
  //   }

  //   return prismaUsers.map(mapPrismaUserToGraphQLUser);
  // }

  async listEmployees(
    userId: string,
    userRole: Role,
    searchTerm?: string,
    skip = 0,
    take = 20
  ): Promise<{ data: EmployeeDTO[]; totalCount: number }> {
    if (!userId) throw new AuthenticationError("User ID is required");

    let filterCompanyIds: string[] | undefined;

    if (userRole === Role.MANAGER) {
      const companies = await prisma.companyUser.findMany({
        where: { userId },
        select: { companyId: true },
      });

      filterCompanyIds = companies.map((c) => c.companyId);

      if (!filterCompanyIds.length) return { data: [], totalCount: 0 };
    }

    const searchFilter: Prisma.CompanyUserWhereInput = searchTerm
      ? {
          OR: [
            { user: { email: { contains: searchTerm, mode: "insensitive" } } },
            {
              user: {
                profile: {
                  firstName: { contains: searchTerm, mode: "insensitive" },
                },
              },
            },
            {
              user: {
                profile: {
                  lastName: { contains: searchTerm, mode: "insensitive" },
                },
              },
            },
            {
              company: { name: { contains: searchTerm, mode: "insensitive" } },
            },
          ],
        }
      : {};

    const whereClause: Prisma.CompanyUserWhereInput = {
      ...searchFilter,
      ...(filterCompanyIds && {
        companyId: { in: filterCompanyIds },
        user: { role: Role.GENERAL_EMPLOYEE },
      }),
    };

    const [companyUsers, totalCount] = await Promise.all([
      prisma.companyUser.findMany({
        where: whereClause,
        select: {
          user: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          company: {
            select: {
              name: true,
            },
          },
        },
        skip,
        take,
      }),
      prisma.companyUser.count({ where: whereClause }),
    ]);

    const data: EmployeeDTO[] = companyUsers.map((cu) => ({
      id: cu.user.id,
      email: cu.user.email,
      profile: cu.user.profile
        ? {
            firstName: cu.user.profile.firstName,
            lastName: cu.user.profile.lastName,
          }
        : null,
      companyName: cu.company.name,
    }));

    return { data, totalCount };
  }
}
