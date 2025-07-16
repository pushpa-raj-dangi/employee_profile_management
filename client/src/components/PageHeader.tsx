import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import type { Role } from "../utils/permissions";
import { useAuth } from "../hooks/useAuth";


type PageHeaderProps = {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  allowedRoles?: Role[]; 
};

const PageHeader = ({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  allowedRoles = ["GENERAL_EMPLOYEE", "MANAGER", "SYSTEM_ADMIN"],
}: PageHeaderProps) => {
  const { user } = useAuth();
  const canShowButton = user && allowedRoles.includes(user.role as Role);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight={"bold"} component="h1">
          {title || "Companies"}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {subtitle || "Manage company information and settings"}
        </Typography>
      </Box>

      {canShowButton && (
        <Box>
          <Button
            onClick={onButtonClick}
            startIcon={<Add />}
            variant="contained"
            color="primary"
          >
            <Typography variant="button" fontWeight="bold">
              {buttonText || "Add New Company"}
            </Typography>
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;
