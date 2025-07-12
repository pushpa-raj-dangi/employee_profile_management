import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import {  RegisterInput } from "../inputs";
import { prisma } from "../prisma";
import { AuthService } from "../services/auth.service";
import { Inject, Service } from "typedi";
import { CustomContext } from "../types";
import { LoginResponse } from "../entities/Auth.entity";
import { ProfileInput } from "../inputs/profile.input";
import { InvitationInput } from "../inputs/invitation.input";

@Service()
@Resolver()
export class AuthResolver {

  @Query(() => String)
  healthCheck(): string {
    return "API is working!";
  }

  constructor(
    @Inject(() => AuthService) private readonly authService: AuthService
  ) {}

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: CustomContext
  ) {
    const { user } = await this.authService.login(email, password);
    ctx.req.session.userId = user.id;
    ctx.req.session.role = user.role;

    return { success: true, user };
  }


  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: CustomContext) {
    return new Promise((resolve, reject) => {
      ctx.req.session.destroy((err: any) => {
        if (err) reject(false);
        ctx.res.clearCookie("connect.sid"); // default cookie name
        resolve(true);
      });
    });
  }

  @Mutation(() => LoginResponse, { nullable: true })
  async me(@Ctx() ctx: CustomContext) {
    if (!ctx.req.session.userId) {
      return null;
    }

    const user = await this.authService.me(ctx.req.session.userId);

    if (!user) {
      return null;
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
      },
    };
  }

  @Mutation(() => Boolean)
  async completeRegistration(
    @Arg("token") token: string,
    @Arg("registerInput") registerInput: RegisterInput,
    @Arg("profileInput") profileInput: ProfileInput,
    @Ctx() ctx: CustomContext
  ) {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { company: true },
    });

    if (!invitation) {
      throw new Error("Invalid invitation token");
    }

    const { user } = await this.authService.completeRegistration(
      invitation as InvitationInput,
      registerInput,
      profileInput
    );

    ctx.req.session.userId = user.id;
    ctx.req.session.role = user.role;

    return true;
  }
}
