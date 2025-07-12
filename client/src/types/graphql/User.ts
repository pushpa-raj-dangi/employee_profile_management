import type { Profile } from "./Profile";

export interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  password?: string; 
  profile?: Profile;
  companies?: any[];
  companyName?: string;
  invitationsSent?: any[];
  invitationsReceived?: any[];
  isActive?: boolean; 
}