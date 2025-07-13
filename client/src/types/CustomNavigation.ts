import type { Navigation } from "@toolpad/core/AppProvider";


export interface RoleBasedNavItem extends Omit<Navigation[number], "kind"> {
  visibleTo?: string[];
}

export type CustomNavigation = (Navigation[number] | RoleBasedNavItem)[];
