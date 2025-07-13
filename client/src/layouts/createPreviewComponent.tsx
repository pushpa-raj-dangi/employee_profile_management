import type { AccountPreviewProps } from "@toolpad/core/Account";
import type { User } from "../types/graphql/User";
import { AccountSidebarPreview } from "./AccountSidebarPreview";


export const createPreviewComponent = (mini: boolean, user: User) => {
  function PreviewComponent(props: AccountPreviewProps) {
    return <AccountSidebarPreview {...props} mini={mini} user={user} />;
  }
  return PreviewComponent;
};
