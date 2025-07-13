import { Box, Typography } from "@mui/material";

type Props = {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
};

const PageSubHeader = ({ title, subtitle, icon }: Props) => {
  return (
    <>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {icon}
        <Typography variant="h6" fontWeight={'bold'} component="h2">
          {title}
        </Typography>
      </Box>
      <Typography variant="body2"  color="text.secondary" sx={{ mb: 2 }}>
        {subtitle}
      </Typography>
    </>
  );
};

export default PageSubHeader;
