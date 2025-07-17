import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver
} from "type-graphql";
import { Inject, Service } from "typedi";
import { ProfileObject } from "../entities/objects/profileObject";
import { PaginatedEmployees } from "../entities/paginatedemployee.entity";
import { Role, User } from "../entities/user.entity";
import { ProfileInput } from "../inputs/profile.input";
import { UserService } from "../services/user.service";
import { CustomContext } from "../types";

@Service()
@Resolver(() => User)
export class UserResolver {
  constructor(
    @Inject(() => UserService) private readonly userService: UserService
  ) {}

  
  @Authorized()
  @Mutation(() => User)
  async updateProfile(
    @Ctx() ctx: CustomContext,
    @Arg("input") input: ProfileInput
  ) {
    return await this.userService.updateProfile(ctx.req.session.userId, input);
  }

  @Query(() => PaginatedEmployees)
  @Authorized([Role.SYSTEM_ADMIN, Role.MANAGER])
  async listEmployees(
    @Ctx() ctx: CustomContext,
    @Arg("searchTerm", { nullable: true }) searchTerm?: string,
    @Arg("skip", () => Int, { defaultValue: 0 }) skip?: number,
    @Arg("take", () => Int, { defaultValue: 20 }) take?: number
  ): Promise<PaginatedEmployees> {

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

  @Query(() => ProfileObject, { nullable: true })
  async getProfile(@Arg("userId") userId: string) {
    return await this.userService.getProfileByUserId(userId);
  }


}
