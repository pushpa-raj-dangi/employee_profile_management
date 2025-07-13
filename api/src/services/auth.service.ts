import { prisma } from "../config/prisma";
import { Role } from "../entities";
import { ValidationError } from "../errors";
import { hashPassword, verifyPassword } from "../utils/auth/auth";
import { InvitationInput } from "../inputs/invitation.input";
import { ProfileInput } from "../inputs/profile.input";
import { RegisterInput } from "../inputs/register.input";
import { Service } from "typedi";

@Service()
export class AuthService {
  async login(email: string, password: string) {
    
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new ValidationError("Invalid email or password");

    const valid = await verifyPassword(password, user.password);
    console.log("Password verification result:", valid);
    if (!valid) throw new ValidationError("Invalid email or password");

    return { user };
  }

  async register(email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ValidationError("User already exists");

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role: Role.GENERAL_EMPLOYEE },
    });

    return { user };
  }

  async completeRegistration(
    invitation: InvitationInput,
    registerInput: RegisterInput,
    profileInput: ProfileInput
  ) {
    if (invitation.status !== "PENDING")
      throw new ValidationError("Invitation already used or cancelled");

    if (invitation.email !== registerInput.email)
      throw new ValidationError("Email doesn't match invitation");
    
    if (invitation.expiresAt < new Date())
      throw new ValidationError("Invitation has expired");

    const hashedPassword = await hashPassword(registerInput.password);

    const user = await prisma.user.create({
      data: {
        email: registerInput.email,
        password: hashedPassword,
        role: invitation.role,
        profile: { create: profileInput },
        companies: { create: { companyId: invitation.companyId } },
      },
      include: { profile: true, companies: { include: { company: true } } },
    });

    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: "COMPLETED", invitedUserId: user.id },
    });

    return { user };
  }

  async logout(session: any) {
    return new Promise((resolve, reject) => {
      session.destroy((err: any) => {
        if (err) reject(false);
        resolve(true);
      });
    });
  }

  async me(userId:string) {
   
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true,  companies: { include: { company: true } } },
    });

    if (!user) return null;

    return user;
  }
}
