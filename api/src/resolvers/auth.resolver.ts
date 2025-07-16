import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { InvitationInput, ProfileInput } from "../inputs";
import { prisma } from "../config/prisma";
import { AuthService } from "../services/auth.service";
import { Inject, Service } from "typedi";
import { CustomContext } from "../types";
import { RESPONSE_CODES } from "../responses/RESPONSE_CODES";
import { MutationResponse } from "../responses/MutationResponse";
import { TokenValidationResponse } from "../responses/TokenValidationResponse";
import { BaseResponse } from "../responses/BaseResponse";
import { ResponseFactory } from "../responses/ResponseFactory";
import { LoginResponse } from "../responses/LoginResponse";
import { Role, User } from "../entities";
import { RegisterInput } from "../inputs/register.input";
import { mapRole } from "../utils/mapping/mapRole";

@Service()
@Resolver()
export class AuthResolver {
  constructor(
    @Inject(() => AuthService) private readonly authService: AuthService
  ) {}

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: CustomContext
  ): Promise<LoginResponse> {
    try {
      const { user } = await this.authService.login(email, password);

      ctx.req.session.userId = user.id;
      ctx.req.session.role = user.role;

      return new LoginResponse(
        true,
        "Login successful",
        RESPONSE_CODES.SUCCESS,
        user as User
      );
    } catch (error: unknown) {
      console.log("ok",error)
      return new LoginResponse(
        false,
        (error as any)?.message || "Login failed",
        RESPONSE_CODES.UNAUTHORIZED
      );
    }
  }

  @Mutation(() => MutationResponse)
  async logout(@Ctx() ctx: CustomContext): Promise<MutationResponse> {
    return new Promise((resolve) => {
      ctx.req.session.destroy((err: any) => {
        if (err) {
          resolve(
            new MutationResponse(false, "Logout failed", RESPONSE_CODES.ERROR)
          );
        } else {
          ctx.res.clearCookie("connect.sid");
          resolve(
            new MutationResponse(
              true,
              "Logout successful",
              RESPONSE_CODES.SUCCESS
            )
          );
        }
      });
    });
  }

  @Query(() => LoginResponse)
  async me(@Ctx() ctx: CustomContext): Promise<LoginResponse> {
    if (!ctx.req.session.userId) {
      return new LoginResponse(
        false,
        "Not authenticated",
        RESPONSE_CODES.UNAUTHORIZED
      );
    }

    try {
      const user = await this.authService.me(ctx.req.session.userId);

      if (!user) {
        return new LoginResponse(
          false,
          "User not found",
          RESPONSE_CODES.NOT_FOUND
        );
      }


      const userFromDb = {
        ...user,
        role: mapRole(user.role),
        companies: user.companies.map((uc) => ({
          ...uc.company,
        })),
      };

      return new LoginResponse(
        true,
        "User retrieved successfully",
        RESPONSE_CODES.SUCCESS,
        userFromDb as User
      );
    } catch (error) {
      return new LoginResponse(
        false,
        "Failed to retrieve user",
        RESPONSE_CODES.ERROR
      );
    }
  }

  @Mutation(() => MutationResponse)
  async completeRegistration(
    @Arg("token") token: string,
    @Arg("registerInput") registerInput: RegisterInput,
    @Arg("profileInput") profileInput: ProfileInput,
    @Ctx() ctx: CustomContext
  ): Promise<MutationResponse> {
    try {
      const invitation = await prisma.invitation.findUnique({
        where: { token },
        include: { company: true },
      });

      if (!invitation) {
        return new MutationResponse(
          false,
          "Invalid invitation token",
          RESPONSE_CODES.INVALID_TOKEN
        );
      }

      const { user } = await this.authService.completeRegistration(
        invitation as InvitationInput,
        registerInput,
        profileInput
      );

      ctx.req.session.userId = user.id;
      ctx.req.session.role = user.role;

      return new MutationResponse(
        true,
        "Registration completed successfully",
        RESPONSE_CODES.SUCCESS,
        1,
        user.id
      );
    } catch (error: unknown) {
      return new MutationResponse(
        false,
        (error as any)?.message || "Registration failed",
        RESPONSE_CODES.ERROR
      );
    }
  }

  @Query(() => TokenValidationResponse)
  async isTokenValid(
    @Arg("token") token: string
  ): Promise<TokenValidationResponse> {
    try {
      const invitation = await prisma.invitation.findUnique({
        where: { token },
      });

      if (!invitation) {
        return new TokenValidationResponse(
          false,
          false,
          "Invalid invitation token",
          RESPONSE_CODES.INVALID_TOKEN,
          "INVALID_TOKEN"
        );
      }

      if (invitation.status !== "PENDING") {
        return new TokenValidationResponse(
          false,
          false,
          "Invitation already used or cancelled",
          RESPONSE_CODES.INVITATION_ALREADY_USED,
          "ALREADY_USED"
        );
      }

      if (invitation.expiresAt < new Date()) {
        return new TokenValidationResponse(
          false,
          false,
          "Invitation has expired",
          RESPONSE_CODES.INVITATION_EXPIRED,
          "EXPIRED"
        );
      }

      return new TokenValidationResponse(
        true,
        true,
        "Token is valid",
        RESPONSE_CODES.SUCCESS
      );
    } catch (error) {
      return new TokenValidationResponse(
        false,
        false,
        "Failed to validate token",
        RESPONSE_CODES.ERROR,
        "VALIDATION_ERROR"
      );
    }
  }

  @Query(() => BaseResponse)
  async validateTokenSimple(
    @Arg("token") token: string
  ): Promise<BaseResponse> {
    try {
      const invitation = await prisma.invitation.findUnique({
        where: { token },
      });

      if (!invitation) {
        return ResponseFactory.notFound("Invalid invitation token");
      }

      if (invitation.status !== "PENDING") {
        return ResponseFactory.validation(
          "Invitation already used or cancelled"
        );
      }

      if (invitation.expiresAt < new Date()) {
        return ResponseFactory.validation("Invitation has expired");
      }

      return ResponseFactory.success(null, "Token is valid");
    } catch (error) {
      return ResponseFactory.error("Failed to validate token");
    }
  }
}
