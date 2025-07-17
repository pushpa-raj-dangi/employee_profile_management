import { Prisma } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import { Service } from "typedi";
import { prisma } from "../config/prisma";
import { EmployeeDTO } from "../entities/dtos/employees/employeedto";
import { ProfileObject } from "../entities/objects/profileObject";
import { Role } from "../entities/user.entity";
import { AuthorizationError, NotFoundError, ValidationError } from "../errors";
import { ProfileInput } from "../inputs/profile.input";

@Service()
export class UserService {
  async updateProfile(currentUserId: string, input: ProfileInput) {
    try {
      return await prisma.$transaction(async (prisma) => {
        try {
          // Input validation
          if (!currentUserId) {
            throw new AuthenticationError("User is not authenticated");
          }

          if (!input.firstName || !input.lastName) {
            throw new ValidationError("First name and last name are required");
          }

          // Fetch current user with companies
          const currentUser = await prisma.user.findUnique({
            where: { id: currentUserId },
            include: { companies: true },
          });

          if (!currentUser) {
            throw new NotFoundError("Current user not found");
          }

          // Fetch target user with profile
          const targetUser = await prisma.user.findUnique({
            where: { id: input.userId },
            include: {
              companies: true,
              profile: true,
            },
          });

          if (!targetUser) {
            throw new NotFoundError("Target user not found");
          }

          // Authorization checks (unchanged)
          const isSelfUpdate = currentUserId === input.userId;
          if (currentUser.role === "GENERAL_EMPLOYEE" && !isSelfUpdate) {
            throw new AuthorizationError(
              "General employees can only update their own profile."
            );
          }

          if (
            currentUser.role === "MANAGER" &&
            !isSelfUpdate &&
            currentUser.companies.length === 0
          ) {
            throw new AuthorizationError(
              "Managers must belong to a company to update others' profiles."
            );
          }

          if (
            currentUser.role === "MANAGER" &&
            !isSelfUpdate &&
            !this.shareSameCompany(currentUser.companies, targetUser.companies)
          ) {
            throw new AuthorizationError(
              "Managers can only update profiles within their own company."
            );
          }

          // Prepare profile data
          const {
            userId: _discardUserId,
            id: _discardId,
            ...profileData
          } = input;
          const { employeeNumber, ...restProfileData } = profileData;

          // Only validate employeeNumber if it's being changed
          if (
            employeeNumber &&
            employeeNumber !== targetUser.profile?.employeeNumber
          ) {
            const duplicate = await prisma.profile.findFirst({
              where: {
                employeeNumber,
                userId: { not: input.userId },
              },
            });

            if (duplicate) {
              throw new ValidationError("Employee number already exists.");
            }
          }

          // Prepare update data - don't include employeeNumber if it's not changing
          const updateData = {
            ...restProfileData,
            ...(employeeNumber &&
            employeeNumber !== targetUser.profile?.employeeNumber
              ? { employeeNumber }
              : {}),
          };

          // Execute the update or create
          if (targetUser.profile) {
            return await prisma.user.update({
              where: { id: input.userId },
              data: {
                profile: {
                  update: updateData,
                },
              },
              include: { profile: true },
            });
          } else {
            return await prisma.user.update({
              where: { id: input.userId },
              data: {
                profile: {
                  create: {
                    employeeNumber: employeeNumber || null,
                    ...restProfileData,
                  },
                },
              },
              include: { profile: true },
            });
          }
        } catch (error) {
          console.error("Error during profile update transaction:", error);
          throw error;
        }
      });
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  }

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

    const searchFilter = searchTerm
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

    const whereClause = {
      ...(filterCompanyIds && {
        companyId: { in: filterCompanyIds },
      }),
      OR: searchTerm
        ? [
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
          ]
        : undefined,
      user: {
        role: Role.GENERAL_EMPLOYEE,
      },
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

  async getEmployeeById(
    userId: string,
    employeeId: string
  ): Promise<ProfileObject> {
    if (!userId) throw new AuthenticationError("User ID is required");

    const employee = await prisma.companyUser.findUnique({
      where: {
        companyId_userId: {
          companyId: employeeId,
          userId: userId,
        },
      },
      select: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                address: true,
                birthday: true,
                phoneNumber: true,
                createdAt: true,
                updatedAt: true,
                profileImage: true,
                department: true,
                employeeNumber: true,
                id: true,
                remarks: true,
                postalCode: true,
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
    });

    if (!employee) throw new NotFoundError("Employee not found");

    return {
      id: employee.user.id,
      address: employee.user.profile?.address || "",
      firstName: employee.user.profile?.firstName || "",
      lastName: employee.user.profile?.lastName || "",
      birthday: employee.user.profile?.birthday as Date,
      phoneNumber: employee.user.profile?.phoneNumber || "",
      profileImage: employee.user.profile?.profileImage || "",
      department: employee.user.profile?.department || "",
      employeeNumber: employee.user.profile?.employeeNumber || "",
      remarks: employee.user.profile?.remarks || "",
      postalCode: employee.user.profile?.postalCode || "",
    };
  }

  async getProfileByUserId(userId: string): Promise<ProfileObject> {
    if (!userId) {
      throw new AuthenticationError("User ID is required");
    }

    // Fetch user with profile info by userId
    const userWithProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            address: true,
            birthday: true,
            phoneNumber: true,
            profileImage: true,
            department: true,
            employeeNumber: true,
            remarks: true,
            postalCode: true,
            id: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!userWithProfile) {
      throw new NotFoundError("User not found");
    }

    if (!userWithProfile.profile) {
      return null;
    }

    // Map to your ProfileObject return type
    return {
      id: userWithProfile.id,
      firstName: userWithProfile.profile.firstName,
      lastName: userWithProfile.profile.lastName,
      address: userWithProfile.profile.address,
      birthday: userWithProfile.profile.birthday,
      phoneNumber: userWithProfile.profile.phoneNumber,
      profileImage: userWithProfile.profile.profileImage,
      department: userWithProfile.profile.department,
      employeeNumber: userWithProfile.profile.employeeNumber,
      remarks: userWithProfile.profile.remarks,
      postalCode: userWithProfile.profile.postalCode,
    };
  }
  private shareSameCompany(
    userCompanies: { companyId: string }[],
    targetCompanies: { companyId: string }[]
  ): boolean {
    const companySet = new Set(userCompanies.map((c) => c.companyId));
    return targetCompanies.some((c) => companySet.has(c.companyId));
  }
}
