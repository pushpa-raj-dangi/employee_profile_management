import { Service } from "typedi";
import { prisma } from "../prisma";

@Service()
export class AdminService {
  async getAllSystemAdmins() {
    const admins = await prisma.user.findMany({
      where: { role: "SYSTEM_ADMIN" }
    });
  
  return admins ?? [];
}

}