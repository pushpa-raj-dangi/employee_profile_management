import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { COMPLETE_REGISTRATION } from "../graphql/mutations/authMutations";

const accountVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
  tempPassword: z
    .string()
    .min(8, "Temporary password must be at least 8 characters"),
});

const profileSetupSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    employeeNumber: z
      .string()
      .min(3, "Employee number must be at least 3 characters"),
    department: z.string().optional(),
    firstName: z.string({
      message: "First Name Required",
    }),
    lastName: z.string({
      message: "Last Name Required",
    }),
    postalCode: z.string()
    .min(3, "Postal code must be at least 3 characters")
    .max(7, "Postal code must not exceed 7 characters")
    .optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    birthday: z.string().optional()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const fullFormSchema = accountVerificationSchema.merge(profileSetupSchema);

type FormData = z.infer<typeof fullFormSchema>;

interface RegistrationFormProps {
  token: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ token }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [completeRegistration, { loading }] = useMutation(
    COMPLETE_REGISTRATION,
    {
      onCompleted: (data) => {
        if (data?.completeRegistration?.success) {
          setActiveStep(2);
          
        } else {
          setError(
            data?.completeRegistration?.message || "Registration failed"
          );
        }
      },
      onError: (error) => {
        setError(error.message);
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(fullFormSchema),
    mode: "onBlur",
  });

  const steps = ["Account Verification", "Profile Setup", "Complete"];

  const handleNext = async () => {
    setError(null);

    if (activeStep === 0) {
      const isValid = await trigger(["email", "tempPassword"]);
      if (!isValid) return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = async (data: FormData) => {
    setError(null);

    const birthDate = new Date(data.birthday!);

    try {
      await completeRegistration({
        variables: {
          token,
          registerInput: {
            email: data.email,
            password: data.newPassword,
            tempPassword: data.tempPassword,
          },
          profileInput: {
            employeeNumber: data.employeeNumber,
            department: data.department || null,
            firstName: data.firstName,
            lastName: data.lastName,
            postalCode: data.postalCode || null,
            address: data.address || null,
            phoneNumber: data.phoneNumber || null,
            birthday: birthDate || null,
          },
        },
      });
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Enter your email and temporary password to begin registration
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email")}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Temporary Password"
              type="password"
              id="tempPassword"
              error={!!errors.tempPassword}
              helperText={
                errors.tempPassword?.message ||
                "Enter the temporary password from your email"
              }
              {...register("tempPassword")}
            />
          </Box>
        );
      case 1:
        return (
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Complete your profile and set your permanent password
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <FormControl component="fieldset" sx={{ mt: 3, width: "100%" }}>
                <FormLabel sx={{ fontWeight: "bold" }} component="legend">
                  Account Setup
                </FormLabel>
                <Grid container spacing={2}>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="New Password"
                      type="password"
                      id="newPassword"
                      error={!!errors.newPassword}
                      helperText={errors.newPassword?.message}
                      {...register("newPassword")}
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Confirm Password"
                      type="password"
                      id="confirmPassword"
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      {...register("confirmPassword")}
                    />
                  </Grid>
                </Grid>
              </FormControl>

              <FormControl component="fieldset" sx={{ mt: 1, width: "100%" }}>
                <FormLabel component="legend" sx={{ fontWeight: "bold" }}>
                  Employee Profile
                </FormLabel>

                <Grid container spacing={2}>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Employee Number"
                      id="employeeNumber"
                      placeholder="e.g., EMP001"
                      error={!!errors.employeeNumber}
                      helperText={errors.employeeNumber?.message}
                      {...register("employeeNumber")}
                    />
                  </Grid>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Department"
                      id="department"
                      placeholder="e.g., Engineering"
                      {...register("department")}
                    />
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>

            <Grid container spacing={2}>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="First Name"
                  id="firstName"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  {...register("firstName")}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Last Name"
                  id="lastName"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  {...register("lastName")}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  fullWidth
                  label="Postal Code"
                  id="postalCode"
                  placeholder="e.g., 100-0001"
                  {...register("postalCode")}
                  inputMode="numeric"
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  fullWidth
                  label="Phone Number"
                  id="phoneNumber"
                  placeholder="e.g., 090-1234-5678"
                  {...register("phoneNumber")}
                />
              </Grid>
            </Grid>

            <TextField
              margin="normal"
              fullWidth
              label="Address"
              id="address"
              multiline
              rows={3}
              {...register("address")}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Birthday"
              id="birthday"
              type="date"
              
              InputLabelProps={{ shrink: true }}
              {...register("birthday")}
            />

          
          </Box>
        );
      case 2:
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h4" gutterBottom color="primary">
              🎉 Registration Complete!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Thank you for registering. Your account has been created
              successfully.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Redirecting to dashboard...
            </Typography>
            <Button
            onClick={()=>navigate('/login')}
            variant="contained"
            >
              Login
            </Button>
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper elevation={1} sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}

        {activeStep < 2 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>

            {activeStep === steps.length - 2 ? (
              <Button
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? "Registering..." : "Complete Registration"}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Continue
              </Button>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default RegistrationForm;
