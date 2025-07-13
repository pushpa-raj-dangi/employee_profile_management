import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";

type PageHeaderProps = {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
};

const PageHeader = ({
  title,
  subtitle,
  buttonText,
  onButtonClick,
}: PageHeaderProps) => {
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
        <Typography
          variant="h4"
          fontWeight={"bold"}
          component="h1"
        >
          {title || "Companies"}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {subtitle || "Manage company information and settings"}
        </Typography>
      </Box>
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
    </Box>
  );
};

export default PageHeader;
