import {
  Resolver,
  Mutation,
  Arg,
  Authorized,
  Query,
  Ctx,
  Int,
} from "type-graphql";
import { User, Role } from "../entities/user.entity";
import { RegisterInput } from "../inputs/register.input";
import { ProfileInput } from "../inputs/profile.input";
import { Invitation } from "../entities/invitation.entity";
import { UserService } from "../services/user.service";
import { Inject, Service } from "typedi";
import { SendInvitationInput } from "../inputs/send-invitation.input";
import { AuthenticationError } from "apollo-server-express";
import { CustomContext } from "../types";
import { EmployeeDTO } from "../entities/DTOS/employees/employeeDto";
import { PaginatedEmployees } from "../entities/paginatedEmployee.entity";
import { ProfileObject } from "../entities/objects/ProfileObject";

@Service()
@Resolver(() => User)
export class UserResolver {
  constructor(
    @Inject(() => UserService) private readonly userService: UserService
  ) {}

  @Authorized(Role.SYSTEM_ADMIN)
  @Mutation(() => User)
  async createSystemAdmin(@Arg("input") input: RegisterInput) {
    return await this.userService.createUser(input, Role.SYSTEM_ADMIN);
  }

  @Mutation(() => User)
  async createUser(
    @Arg("input") input: RegisterInput,
    @Arg("role", () => Role) role: Role
  ) {
    return await this.userService.createUser(input, role);
  }

  @Authorized()
  @Mutation(() => User)
  async updateProfile(
    @Ctx() ctx: CustomContext,
    @Arg("input") input: ProfileInput
  ) {
    return await this.userService.updateProfile(ctx.req.session.userId, input);
  }

  @Authorized([Role.SYSTEM_ADMIN, Role.MANAGER])
  @Mutation(() => Invitation)
  async sendInvitation(
    @Ctx() ctx: CustomContext,
    @Arg("input") input: SendInvitationInput
  ) {
    if (!ctx.req?.session.id || !ctx.req?.session.role) {
      throw new AuthenticationError("Authentication required");
    }

    return await this.userService.sendInvitation(
      ctx.req.session.userId,
      ctx.req.session.role,
      input
    );
  }

  @Query(() => PaginatedEmployees)
  @Authorized([Role.SYSTEM_ADMIN, Role.MANAGER])
  async listEmployees(
    @Ctx() ctx: CustomContext,
    @Arg("searchTerm", { nullable: true }) searchTerm?: string,
    @Arg("skip", () => Int, { defaultValue: 0 }) skip?: number,
    @Arg("take", () => Int, { defaultValue: 20 }) take?: number
  ): Promise<PaginatedEmployees> {
    if (!ctx.req?.session.userId || !ctx.req?.session.role) {
      throw new Error("Authentication required");
    }

    return await this.userService.listEmployees(
      ctx.req.session.userId,
      ctx.req.session.role,
      searchTerm,
      skip,
      take
    );
  }


  @Query(() => ProfileObject, { nullable: true })
  @Authorized([Role.SYSTEM_ADMIN, Role.MANAGER])
  async getEmployeeById(
    @Ctx() ctx: CustomContext,
    @Arg("employeeId") employeeId: string
  ): Promise<ProfileObject | null> {
    return await this.userService.getEmployeeById(
      ctx.req.session.userId,
      employeeId
    );
  }

}
