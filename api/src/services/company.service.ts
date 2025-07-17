import { GraphQLError } from "graphql";
import { Service } from "typedi";
import { prisma } from "../config/prisma";
import { CompanyDTO } from "../entities/dtos/company/companydto";
import { Role } from "../entities/user.entity";
import { CreateCompanyInput } from "../inputs/create-company.input";
import { UpdateCompanyInput } from "../inputs/update-company.Input";
import { CustomContext } from "../types";
import { isSystemAdmin } from "../utils/permission";

@Service()
export class CompanyService {
  async getCompanies(ctx: CustomContext): Promise<CompanyDTO[]> {
    if (isSystemAdmin(ctx)) {
      const companies = await prisma.company.findMany({
        include: { users: true },
      });
      return companies as CompanyDTO[];
    } else {
      const companies = await prisma.company.findMany({
        where: {
          users: {
            some: {
              userId: ctx.req.session.userId,
            },
          },
        },
        include: { users: true },
      });
      return companies as CompanyDTO[];
    }
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
