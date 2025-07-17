import { z } from "zod";
import { Role } from "../../utils/permissions";

export const invitationSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(Role, "Invalid role"),
  companyId: z.string().optional(),
});
export type InvitationData = z.infer<typeof invitationSchema>;