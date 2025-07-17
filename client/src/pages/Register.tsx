import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import RegisterForm from "../components/RegisterForm";

const Register = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (!token) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
        <Typography ml={2}>Validating token...</Typography>
      </Box>
    );
  }

  if (!token) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <Alert severity="error">Invalid or expired token</Alert>
        <Typography sx={{ mt: 2 }}>
          Please ensure you have a valid registration link.
        </Typography>
        <Typography>
          Registration token is required to complete the registration process.
        </Typography>

        <Button variant="contained" href="/login" style={{ marginTop: "20px" }}>
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Complete Your Registration
      </Typography>
      <RegisterForm token={token} />
    </Box>
  );
};

export default Register;
