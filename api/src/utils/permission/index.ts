import { Role } from "../../entities";
import { CustomContext } from "../../types";

export const Permissions = {
  INVITE_USER: ['SystemAdmin', 'Manager'],
  VIEW_ALL_PROFILES: ['SystemAdmin'],
  EDIT_OWN_PROFILE: ['SystemAdmin', 'Manager', 'GeneralEmployee'],
  VIEW_COMPANY_INFO: ['SystemAdmin', 'Manager', 'GeneralEmployee'],
  EDIT_COMPANY_INFO: ['SystemAdmin', 'Manager'],
  SEARCH_EMPLOYEES: ['SystemAdmin', 'Manager'],
};


export function isSystemAdmin(ctx: CustomContext): boolean {
  return ctx.req.session.role === Role.SYSTEM_ADMIN;
}

export function isManager(ctx: CustomContext): boolean {
  return ctx.req.session.role === Role.MANAGER;
}

