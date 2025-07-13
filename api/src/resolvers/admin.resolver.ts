import { Arg, Authorized, Mutation, Resolver } from "type-graphql";
import { Role } from "../entities/user.entity";
import { prisma } from "../config/prisma";
import { generateToken, hashPassword } from "../utils/auth/auth";
import { sendEmail } from "../utils/email";

@Resolver()
export class AdminResolver {
  @Authorized(Role.SYSTEM_ADMIN)
  @Mutation(() => Boolean)
  async createSystemAdmin(@Arg("email") email: string) {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // 2. Generate temporary password and token
    const tempPassword = generateToken().substring(0, 12);
    const hashedPassword = await hashPassword(tempPassword);

    // 3. Create user with temporary password
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: Role.SYSTEM_ADMIN,
      },
    });

    // 4. Send email with registration link
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