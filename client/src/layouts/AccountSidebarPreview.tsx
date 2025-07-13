import { Divider, Stack } from "@mui/material";
import { AccountPreview, type AccountPreviewProps } from "@toolpad/core/Account";
import type { User } from "../types/graphql/User";

export  function AccountSidebarPreview(props: AccountPreviewProps & { mini: boolean, user: User }) {
  const { handleClick, open, mini } = props;
  
  return (
    <Stack direction="column" p={0}>
      <Divider />
      <AccountPreview
        variant={mini ? "condensed" : "expanded"}
        handleClick={handleClick}
        open={open}
      />
    </Stack>
  );
}