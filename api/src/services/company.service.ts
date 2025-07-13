import { Service } from "typedi";
import { prisma } from "../config/prisma";
import { CreateCompanyInput } from "../inputs/create-company.input";
import { UpdateCompanyInput } from "../inputs/update-company.Input";
import { CustomContext } from "../types";
import { GraphQLError } from "graphql";
import { Role } from "../entities/user.entity";
import { isSystemAdmin } from "../utils/permission";
import { CompanyDTO } from "../entities/DTOS/company/companyDto";

@Service()
export class CompanyService {
  async getCompanies(ctx: CustomContext): Promise<CompanyDTO[]> {
    const companies = await prisma.company.findMany({
      include: { users: true },
    });

    if (isSystemAdmin(ctx)) {
      return companies as CompanyDTO[];
    }

    return companies.filter((company) =>
      company.users.some((user) => user.id === ctx.req.session.userId)
    ) as CompanyDTO[];
  }

  async getCompanyById(id: string, ctx: CustomContext) {
    const company = await prisma.company.findUnique({ where: { id } });

    if (!company) {
      throw new GraphQLError("Company not found");
    }

    if (isSystemAdmin(ctx)) return company;

    const isUserInCompany = await prisma.companyUser.findFirst({
      where: {
        companyId: id,
        userId: ctx.req.session.userId,
      },
    });

    if (!isUserInCompany) {
      throw new GraphQLError(
        "Unauthorized: You do not have access to this company"
      );
    }

    return company;
  }

  async createCompany(input: CreateCompanyInput) {
    return await prisma.company.create({
      data: { ...input },
    });
  }

  async updateCompany(
    id: string,
    input: UpdateCompanyInput,
    ctx: CustomContext
  ) {
    const company = await prisma.company.findUnique({
      where: { id: input.id },
      include: { users: true },
    });

    if (!company) throw new GraphQLError("Company not found");

    if (isSystemAdmin(ctx)) {
      return await prisma.company.update({
        where: { id: input.id },
        data: input,
      });
    }

    const isManagerOfCompany = await prisma.companyUser.findFirst({
      where: {
        companyId: input.id,
        userId: ctx.req.session.userId,
        user: { role: Role.MANAGER },
      },
    });

    if (!isManagerOfCompany) {
      throw new GraphQLError("Access denied");
    }

    return await prisma.company.update({
      where: { id: input.id },
      data: input,
    });
  }
}
