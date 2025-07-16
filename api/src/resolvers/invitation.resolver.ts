import { Resolver, Query, Mutation, Arg, Authorized, Ctx } from "type-graphql";
import { Invitation, InvitationStatus } from "../entities/invitation.entity";
import { prisma } from "../config/prisma";
import { Role, User } from "../entities/user.entity";
import { RegisterInput } from "../inputs/register.input";
import { ProfileInput } from "../inputs/profile.input";
import { hash } from "bcrypt";
import { CustomContext } from "../types";

@Resolver(Invitation)
export class InvitationResolver {
  @Authorized([Role.SYSTEM_ADMIN, Role.MANAGER])
  @Query(() => [Invitation])
  async listInvitations(@Ctx() ctx: CustomContext) {
    if (ctx.req.session.role === Role.SYSTEM_ADMIN) {
      return prisma.invitation.findMany({
        include: {
          invitedBy: true,
          invitedUser: true,
          company: true,
        },
      });
    } else {
      // For managers, only show invitations they sent to their companies
      const companyUsers = await prisma.companyUser.findMany({
        where: { userId: ctx.req.session.userId },
        select: { companyId: true },
      });

      const companyIds = companyUsers.map((cu) => cu.companyId);

      return prisma.invitation.findMany({
        where: {
          invitedById: ctx.req.session.userId,
          companyId: { in: companyIds },
        },
        include: {
          invitedBy: true,
          invitedUser: true,
          company: true,
        },
      });
    }
  }

  @Mutation(() => User)
  async acceptInvitation(
    @Arg("token") token: string,
    @Arg("registerInput") registerInput: RegisterInput,
    @Arg("profileInput") profileInput: ProfileInput
  ) {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { company: true },
    });

    if (!invitation) {
      throw new Error("Invalid invitation token");
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new Error("This invitation has already been used or cancelled");
    }

    if (new Date() > invitation.expiresAt) {
      throw new Error("This invitation has expired");
    }

    if (invitation.email !== registerInput.email) {
      throw new Error("Email doesn't match invitation");
    }

    const hashedPassword = await hash(registerInput.password, 10);

    const user = await prisma.user.create({
      data: {
        email: registerInput.email,
        password: hashedPassword,
        role: invitation.role,
        profile: {
          create: profileInput,
        },
        companies: {
          create: {
            companyId: invitation.companyId,
          },
        },
      },
      include: {
        profile: true,
        companies: true,
      },
    });

    // Update invitation status
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: {
        status: InvitationStatus.COMPLETED,
        invitedUserId: user.id,
      },
    });

    return user;
  }

  @Authorized([Role.SYSTEM_ADMIN, Role.MANAGER])
  @Mutation(() => Invitation)
  async cancelInvitation(@Ctx() ctx: CustomContext, @Arg("id") id: string) {
    const invitation = await prisma.invitation.findUnique({
      where: { id },
    });

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    // Verify permission
    if (
      ctx.req.session.role === Role.MANAGER &&
      invitation.invitedById !== ctx.req.session.userId
    ) {
      throw new Error("You can only cancel invitations you sent");
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new Error("Only pending invitations can be cancelled");
    }

    return prisma.invitation.update({
      where: { id },
      data: {
        status: InvitationStatus.CANCELLED,
      },
    });
  }
}
