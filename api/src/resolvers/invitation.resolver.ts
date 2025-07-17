import { hash } from "bcrypt";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { prisma } from "../config/prisma";
import { Invitation, InvitationStatus } from "../entities/invitation.entity";
import { Role, User } from "../entities/user.entity";
import { ProfileInput } from "../inputs/profile.input";
import { RegisterInput } from "../inputs/register.input";
import { CustomContext } from "../types";

import { Inject, Service } from "typedi";
import {
  InvitationResponse,
  SendInvitationInput,
} from "../inputs/send-invitation.input";
import { InvitationItemResponse } from "../responses/Invitation";
import { InvitationService } from "../services/invitation.service";

@Service()
@Resolver(Invitation)
export class InvitationResolver {
  constructor(
    @Inject(() => InvitationService)
    private readonly invitationService: InvitationService
  ) {}

  @Authorized([Role.SYSTEM_ADMIN, Role.MANAGER])
  @Query(() => [InvitationItemResponse])
  async listInvitations(@Ctx() ctx: CustomContext) {
    console.log("Fetching invitations for user:", ctx.req.session.userId);
    return await this.invitationService.getInvitations(
      ctx.req.session.userId,
      ctx.req.session.role
    );
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
  @Mutation(() => Boolean)
  async cancelInvitation(@Ctx() ctx: CustomContext, @Arg("id") id: string) {
    return await this.invitationService.cancelInvitation(id, ctx.req.session.userId);
  }

  @Authorized([Role.SYSTEM_ADMIN, Role.MANAGER])
  @Mutation(() => InvitationResponse)
  async sendInvitation(
    @Ctx() ctx: CustomContext,
    @Arg("input") input: SendInvitationInput
  ): Promise<InvitationResponse> {
    const result = await this.invitationService.sendInvitation(
      ctx.req.session.userId,
      ctx.req.session.role,
      input
    );

    return {
      success: true,
      message: "Invitation sent successfully",
    };
  }

  @Mutation(() => InvitationResponse)
  async sendInvitationToSystemAdmin(
    @Ctx() ctx: CustomContext,
    @Arg("input") input: SendInvitationInput
  ): Promise<InvitationResponse> {
    const result = await this.invitationService.sendInvitationToSystemAdmin(
      ctx.req.session.userId,
      ctx.req.session.role,
      input
    );

    return {
      success: true,
      message: "Invitation sent successfully",
    };
  }


}
