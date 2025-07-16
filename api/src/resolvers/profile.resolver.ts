import { Resolver, Mutation, Arg, Query, Authorized, Ctx } from "type-graphql";
import { ProfileInput } from "../inputs/profile.input";
import { prisma } from "../config/prisma";
import { Profile } from "../entities/profile.entity";
import { Role } from "../entities";
import { CustomContext } from "../types";

@Resolver(Profile)
export class ProfileResolver {
  @Authorized()
  @Mutation(() => Profile)
  async updateProfile(
    @Ctx() ctx: CustomContext,
    @Arg("input") input: ProfileInput,
    @Arg("userId", { nullable: true }) userId?: string
  ) {
    // System admins can update any profile
    // Managers can update profiles in their company
    // Regular users can only update their own profile

    const targetUserId = userId || ctx.req.session.userId;

    if (
      ctx.req.session.role === Role.GENERAL_EMPLOYEE &&
      targetUserId !== ctx.req.session.userId
    ) {
      throw new Error("You can only update your own profile");
    }

    if (ctx.req.session.role === Role.MANAGER && targetUserId !== ctx.req.session.userId) {
      // Verify the target user is in the same company
      const targetUserCompanies = await prisma.companyUser.findMany({
        where: { userId: targetUserId },
        select: { companyId: true },
      });

      const managerCompanies = await prisma.companyUser.findMany({
        where: { userId: ctx.req.session.userId },
        select: { companyId: true },
      });

      const hasCommonCompany = targetUserCompanies.some((tc:any) =>
        managerCompanies.some((mc:any) => mc.companyId === tc.companyId)
      );

      if (!hasCommonCompany) {
        throw new Error("You can only update profiles in your company");
      }
    }

    return prisma.profile.upsert({
      where: { userId: targetUserId },
      update: input,
      // create: {
      //   ...input,
      //   user: { connect: { id: targetUserId } },
      //   userId: targetUserId,
      // },
      create: {
        ...input,
        userId: targetUserId,
      },
    });
  }

  @Authorized()
  @Query(() => Profile, { nullable: true })
  async getProfile(
    @Ctx() ctx: CustomContext,
    @Arg("userId", { nullable: true }) userId?: string
  ) {
    const targetUserId = userId || ctx.req.session.userId;

    // Authorization checks similar to updateProfile
    if (
      ctx.req.session.role === Role.GENERAL_EMPLOYEE &&
      targetUserId !== ctx.req.session.userId
    ) {
      throw new Error("You can only view your own profile");
    }

    if (ctx.req.session.role === Role.MANAGER && targetUserId !== ctx.req.session.userId) {
      // Verify same company
      const targetUserCompanies = await prisma.companyUser.findMany({
        where: { userId: targetUserId },
        select: { companyId: true },
      });

      const managerCompanies = await prisma.companyUser.findMany({
        where: { userId: ctx.req.session.userId },
        select: { companyId: true },
      });

      const hasCommonCompany = targetUserCompanies.some((tc:any) =>
        managerCompanies.some((mc:any) => mc.companyId === tc.companyId)
      );

      if (!hasCommonCompany) {
        throw new Error("You can only view profiles in your company");
      }
    }

    return prisma.profile.findUnique({
      where: { userId: targetUserId },
    });
  }
}
