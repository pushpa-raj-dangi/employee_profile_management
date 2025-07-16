import { useMutation } from "@apollo/client";
import { Alert, Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";
import RegisterForm from "../components/RegisterForm";
import { IS_TOKEN_VALID } from "../graphql/mutations/authMutations";

const Register = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const [validateToken, { data, loading, error }] = useMutation(IS_TOKEN_VALID);

  useEffect(() => {
    if (token) {
      validateToken({ variables: { token } });
    }
  }, [token, validateToken]);

  console.log("Token:", token, data, loading, error);

  if (!token || error) {
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
        <Alert severity="error">Error: No token provided</Alert>
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
    <div>
      <RegisterForm token={token} />
    </div>
  );
};

export default Register;
