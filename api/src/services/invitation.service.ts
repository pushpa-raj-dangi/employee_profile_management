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
  
  constructor(
    @Inject(() => EmailService) private emailService: EmailService
  ) {}


  async getInvitations(currentUserId:string,currentUserRole:string):Promise<InvitationItemResponse[]>
  {
    if (currentUserRole === Role.SYSTEM_ADMIN) {
      const invitations= await prisma.invitation.findMany({
        include: {
          company: true,
          invitedBy:{
            include:{
              profile:{
                select: {
                  firstName: true,
                  lastName: true,
                },
              }
            }
          }
        },
      });
      console.log("System invitations:", invitations);
      const mappedInvitations: InvitationItemResponse[] = invitations.map(invitation => ({
      id: invitation.id,
      email: invitation.email,
      token: invitation.token,
      status: invitation.status as InvitationStatus,
      role: invitation.role as Role,
      invitedBy: invitation.invitedBy
        ? {
            id: invitation.invitedBy.id,
            fullName:
              (invitation.invitedBy.profile?.firstName ?? '') +
              ' ' +
              (invitation.invitedBy.profile?.lastName ?? ''),
            role: invitation.invitedBy.role as Role,
          }
        : undefined,
    }));

      return mappedInvitations;
    }
    if (currentUserRole === Role.MANAGER) {
      const userCompanies = await prisma.companyUser.findMany({
        where: { userId: currentUserId },
        select: { companyId: true },

      });

      const invitations =  await prisma.invitation.findMany({
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

      const mappedInvitations:InvitationItemResponse[] = invitations.map(invitation => ({
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
              (invitation.invitedBy.profile?.firstName ?? '') +
              ' ' +
              (invitation.invitedBy.profile?.lastName ?? ''),
            role: invitation.invitedBy.role as Role,
          }
        : undefined,
      }));
      return mappedInvitations;
    }
    
    
  }

  async sendInvitation(
    invitedById: string,
    inviterRole: Role,
    input: SendInvitationInput
  ) {
    return await prisma.$transaction(async (prisma) => {
      const { email, role, companyId } = input;
  

      if (!email || !role ) {
        throw new ValidationError("Email, role are required");
      }


      if (inviterRole === Role.MANAGER) {
        const companyUser = await prisma.companyUser.findFirst({
          where: { companyId, userId: invitedById },
        });

        if (!companyUser) {
          throw new AuthorizationError(
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
      await this.emailService.sendInvitationEmail(email,tempPassword,token)

      return invitation;
    });
  }


  async sendInvitationToSystemAdmin(
    invitedById: string,
    currentUserRole: Role,
    input: SendInvitationInput
  ) {

    if (currentUserRole !== Role.SYSTEM_ADMIN) {
      throw new AuthorizationError("Only system admins can send invitations");
    }

    //check for existing invitation
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

    await this.emailService.sendInvitationEmail(input.email,tempPassword,token);
    return invitation;
  }

  private shareSameCompany(
    userCompanies: { companyId: string }[],
    targetCompanies: { companyId: string }[]
  ): boolean {
    const companySet = new Set(userCompanies.map((c) => c.companyId));
    return targetCompanies.some((c) => companySet.has(c.companyId));
  }
}
