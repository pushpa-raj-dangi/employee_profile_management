import type { SidebarFooterProps } from "@toolpad/core/DashboardLayout";
import { createPreviewComponent } from "./createPreviewComponent";
import { SidebarFooterAccountPopover } from "./SidebarFooterAccountPopover";
import { useMemo } from "react";
import { Account } from "@toolpad/core/Account";
import { useAuth } from "../hooks/useAuth";

export function SidebarFooterAccount({ mini }: SidebarFooterProps) {
  const { user } = useAuth();
  const PreviewComponent = useMemo(
    () => createPreviewComponent(mini, user!),
    [mini, user]
  );

  return (
    <Account
      slots={{
        preview: PreviewComponent,
        popoverContent: SidebarFooterAccountPopover,
      }}
      slotProps={{
        popover: {
          transformOrigin: { horizontal: "left", vertical: "bottom" },
          anchorOrigin: { horizontal: "right", vertical: "bottom" },
          disableAutoFocus: true,
          slotProps: {
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: (theme) => `drop-shadow(0px 2px 8px ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.32)"})`,
                mt: 1,
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  bottom: 10,
                  left: 0,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translate(-50%, -50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          },
        },
      }} />
  );
}
