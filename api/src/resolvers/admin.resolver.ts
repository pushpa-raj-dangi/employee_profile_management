import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Role, User } from "../entities/user.entity";
import { prisma } from "../config/prisma";
import { generateToken, hashPassword } from "../utils/auth/auth";
import { sendEmail } from "../utils/email";
import { Inject, Service } from "typedi";
import { AdminService } from "../services/admin.service";

@Service()
@Resolver()
export class AdminResolver {

  constructor(
    @Inject(() => AdminService) private readonly adminService: AdminService
  ) {}


  @Authorized(Role.SYSTEM_ADMIN)
  @Query(() => [User])
  async getAllSystemAdmins() {
    const admins = await this.adminService.getAllSystemAdmins();
  return admins ?? [];
  }

  @Authorized(Role.SYSTEM_ADMIN)
  @Mutation(() => Boolean)
  async createSystemAdmin(@Arg("email") email: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const tempPassword = generateToken().substring(0, 12);
    const hashedPassword = await hashPassword(tempPassword);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: Role.SYSTEM_ADMIN,
      },
    });

    const registrationToken = generateToken();
    const registrationUrl = `${process.env.FRONTEND_URL}/register?token=${registrationToken}`;

    await sendEmail({
      to: email,
      subject: "System Administrator Account Setup",
      text: `You have been invited to be a System Administrator. 
             Temporary password: ${tempPassword}
             Complete your registration here: ${registrationUrl}`,
      html: `<p>You have been invited to be a System Administrator.</p>
             <p>Temporary password: <strong>${tempPassword}</strong></p>
             <p>Complete your registration here: <a href="${registrationUrl}">${registrationUrl}</a></p>`,
    });

    return true;
  }
}