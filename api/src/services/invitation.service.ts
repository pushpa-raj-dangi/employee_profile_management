import { Inject, Service } from "typedi";
import { prisma } from "../config/prisma";
import { InvitationStatus } from "../entities/invitation.entity";
import { Role } from "../entities/user.entity";
import { AuthorizationError, ValidationError } from "../errors";
import { SendInvitationInput } from "../inputs/send-invitation.input";
import { InvitationItemResponse } from "../responses/Invitation";
import { generateToken, hashPassword } from "../utils/auth/auth";
import { EmailService } from "./email.service";

@Service()
export class InvitationService {
  constructor(@Inject(() => EmailService) private emailService: EmailService) {}

  async getInvitations(
    currentUserId: string,
    currentUserRole: string
  ): Promise<InvitationItemResponse[]> {
    if (currentUserRole === Role.SYSTEM_ADMIN) {
      const invitations = await prisma.invitation.findMany({
        include: {
          company: true,
          invitedBy: {
            include: {
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  employeeNumber: true,
                },
              },
            },
          },
        },
      });
      console.log("System invitations:", invitations);
      const mappedInvitations: InvitationItemResponse[] = invitations.map(
        (invitation) => ({
          id: invitation.id,
          email: invitation.email,
          token: invitation.token,
          status: invitation.status as InvitationStatus,
          role: invitation.role as Role,
          invitedBy: invitation.invitedBy
            ? {
                id: invitation.invitedBy.id,
                fullName:
                  (invitation.invitedBy.profile?.firstName ?? "") +
                    " " +
                    (invitation.invitedBy.profile?.lastName ?? "") ||
                  invitation.invitedBy.email,
                role: invitation.invitedBy.role as Role,
                email:
                  invitation.invitedBy.email
              }
            : undefined,
            
        })
      );

      return mappedInvitations;
    }
    if (currentUserRole === Role.MANAGER) {
      const userCompanies = await prisma.companyUser.findMany({
        where: { userId: currentUserId },
        select: { companyId: true },
      });

      const invitations = await prisma.invitation.findMany({
        where: {
          companyId: {
            in: userCompanies.map((c) => c.companyId),
          },
        },
        include: {
          company: true,
          invitedBy: {
            include: {
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      const mappedInvitations: InvitationItemResponse[] = invitations.map(
        (invitation) => ({
          id: invitation.id,
          email: invitation.email,
          token: invitation.token,
          status: invitation.status as InvitationStatus,
          role: invitation.role as Role,
          company: invitation.company,
          invitedBy: invitation.invitedBy
            ? {
                id: invitation.invitedBy.id,
                fullName:
                  (invitation.invitedBy.profile?.firstName ?? "") +
                    " " +
                    (invitation.invitedBy.profile?.lastName ?? "") ||
                  invitation.invitedBy.email,
                role: invitation.invitedBy.role as Role,
              }
            : undefined,
        })
      );
      return mappedInvitations;
    }
  }

  async sendInvitationToSystemAdmin(
    invitedById: string,
    currentUserRole: Role,
    input: SendInvitationInput
  ) {
    if (currentUserRole !== Role.SYSTEM_ADMIN) {
      throw new AuthorizationError(
        "Only system admins can send invitations to other system admins"
      );
    }

    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email: input.email,
        status: InvitationStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingInvitation) {
      throw new ValidationError(
        "Pending invitation already exists for this email",
        "email"
      );
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const tempPassword = generateToken().substring(0, 12);
    const invitation = await prisma.invitation.create({
      data: {
        email: input.email,
        role: input.role as Role,
        token,
        expiresAt,
        status: InvitationStatus.PENDING,
        invitedById: invitedById,
        companyId: input.companyId,
        tempPassword: await hashPassword(tempPassword),
      },
    });

    await this.emailService.sendInvitationEmail(
      input.email,
      tempPassword,
      token
    );
    return invitation;
  }

  async sendInvitation(
    invitedById: string,
    currentUserRole: Role,
    input: SendInvitationInput
  ) {
    // Check permissions based on role
    if (currentUserRole === Role.SYSTEM_ADMIN) {
      // SYSTEM_ADMIN can invite anyone to any company or without company
      if (input.role === Role.SYSTEM_ADMIN && input.companyId) {
        throw new AuthorizationError(
          "System admins cannot belong to a company"
        );
      }
    } else if (currentUserRole === Role.MANAGER) {
      // MANAGER can only invite to their own company
      if (!input.companyId) {
        throw new AuthorizationError(
          "Company must be specified when inviting as manager"
        );
      }

      const companyUser = await prisma.companyUser.findFirst({
        where: {
          userId: invitedById,
          companyId: input.companyId,
        },
      });

      if (!companyUser) {
        throw new AuthorizationError("You can only invite to your own company");
      }
    } else {
      throw new AuthorizationError(
        "You don't have permission to send invitations"
      );
    }

    // General users must have a company
    if (input.role === Role.GENERAL_EMPLOYEE && !input.companyId) {
      throw new AuthorizationError(
        "General employees must belong to a company"
      );
    }

    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email: input.email,
        status: InvitationStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingInvitation) {
      throw new ValidationError(
        "Pending invitation already exists for this email",
        "email"
      );
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const tempPassword = generateToken().substring(0, 12);

    const invitation = await prisma.invitation.create({
      data: {
        email: input.email,
        role: input.role as Role,
        token,
        expiresAt,
        status: InvitationStatus.PENDING,
        invitedById: invitedById,
        companyId: input.companyId,
        tempPassword: await hashPassword(tempPassword),
      },
    });

    await this.emailService.sendInvitationEmail(
      input.email,
      tempPassword,
      token
    );

    return invitation;
  }
  async cancelInvitation(id: string, currentUserId: string) {
    const invitation = await prisma.invitation.findUnique({
      where: { id },
      include: {
        invitedBy: {
          include: {
            companies: {
              include: {
                company: true,
              },
            },
          },
        },
        company: true,
      },
    });

    if (!invitation) {
      throw new ValidationError("Invitation not found", "id");
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new ValidationError(
        "Only pending invitations can be cancelled",
        "status"
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      include: {
        companies: true,
      },
    });

    if (!currentUser) {
      throw new ValidationError("User not found", "user");
    }

    const isSystemAdmin = currentUser.role === Role.SYSTEM_ADMIN;

    const isManager = currentUser.role === Role.MANAGER;

    // Check if user is the inviter and in the same company
    const isSameCompany =
      invitation.companyId &&
      currentUser.companies.some((cu) => cu.companyId === invitation.companyId);

    const isAllowedManager =
      isManager && invitation.invitedById === currentUserId && isSameCompany;

    if (!isSystemAdmin && !isAllowedManager) {
      throw new ValidationError(
        "You don't have permission to cancel this invitation",
        "permission"
      );
    }

    await prisma.invitation.update({
      where: { id },
      data: {
        status: InvitationStatus.CANCELLED,
      },
    });

    return true;
  }
}
