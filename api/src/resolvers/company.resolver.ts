import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Service } from "typedi";
import { Company } from "../entities/company.entity";
import { Role } from "../entities/user.entity";
import { CreateCompanyInput } from "../inputs/create-company.input";
import { UpdateCompanyInput } from "../inputs/update-company.Input";
import { CompanyService } from "../services/company.service";
import { CustomContext } from "../types";
@Service()
@Resolver(Company)
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  @Authorized()
  @Query(() => [Company])
  async companies(@Ctx() ctx: CustomContext) {
    return this.companyService.getCompanies(ctx);
  }

  @Authorized()
  @Query(() => Company)
  async company(@Arg("id", () => ID) id: string, @Ctx() ctx: CustomContext) {
    return this.companyService.getCompanyById(id, ctx);
  }

  @Mutation(() => Company)
  @Authorized(Role.SYSTEM_ADMIN)
  async createCompany(@Arg("input") input: CreateCompanyInput) {
    return this.companyService.createCompany(input);
  }

  @Mutation(() => Company)
  @Authorized([Role.SYSTEM_ADMIN, Role.MANAGER])
  async updateCompany(
    @Arg("input") input: UpdateCompanyInput,
    @Ctx() ctx: CustomContext
  ) {
    return this.companyService.updateCompany(input, ctx);
  }
}
