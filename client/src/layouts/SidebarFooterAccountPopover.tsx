import { Divider, Stack, Typography } from "@mui/material";
import { AccountPopoverFooter, SignOutButton } from "@toolpad/core/Account";
import { useAuth } from "../hooks/useAuth";

export function SidebarFooterAccountPopover() {
  const { user } = useAuth();
  
  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="body2" padding={2} mx={2} mt={1}>
        Account Details
      </Typography>
      <Divider />
      <Stack px={2} py={1} spacing={0.5}>
        <Typography variant="subtitle2">{user?.email}</Typography>
        {user?.role && (
          <Typography variant="caption" color="text.secondary">
            Role: {user.role}
          </Typography>
        )}
      </Stack>
      <Divider />
      <AccountPopoverFooter>
        <SignOutButton />
      </AccountPopoverFooter>
    </Stack>
  );
}