import type { Role } from "../../utils/permissions";

export interface InvitedBy {
  id: string;
  fullName: string;
}

export interface InvitationResponse {
  id: string;
  email: string;
  token: string;
  role: Role;
  status: string;
  invitedBy?: InvitedBy;
}
