import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Box,
  Paper,
  FormControl,
  FormLabel,
  FormHelperText,
  Checkbox,
  Grid,
} from "@mui/material";

interface Error {
  email?: string;
  tempPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  employeeNumber?: string;
  department?: string;
  fullName?: string;
  postalCode?: string;
  phoneNumber?: string;
  agreeTerms?: string;
  name?: string;
}

const RegistrationForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    tempPassword: "",
    newPassword: "",
    confirmPassword: "",
    employeeNumber: "",
    department: "",
    fullName: "",
    postalCode: "",
    phoneNumber: "",
    address: "",
    birthday: "",
    notes: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState<Error>({} as Error);

  const steps = ["Account Verification", "Profile Setup"];

  const handleNext = () => {
    if (activeStep === 0) {
      const newErrors = {} as Error;
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.tempPassword)
        newErrors.tempPassword = "Temporary password is required";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user types
    if (errors.name as string) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.name;
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate step 2 fields
    const newErrors = {} as Error;
    if (!formData.newPassword) newErrors.newPassword = "Password is required";
    if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.employeeNumber)
      newErrors.employeeNumber = "Employee number is required";
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.agreeTerms)
      newErrors.agreeTerms = "You must agree to the terms";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form data
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Enter your email and temporary password to begin registration
            </Typography>

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="tempPassword"
              label="Temporary Password"
              type="password"
              id="tempPassword"
              value={formData.tempPassword}
              onChange={handleChange}
              error={!!errors.tempPassword}
              helperText={
                errors.tempPassword ||
                "Enter the temporary password from your email"
              }
            />
          </Box>
        );
      case 1:
        return (
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Complete your profile and set your permanent password
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <FormControl component="fieldset" sx={{ mt: 3, width: "100%" }}>
                <FormLabel
                  sx={{
                    fontWeight: "bold",
                  }}
                  component="legend"
                >
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
                      name="newPassword"
                      label="New Password"
                      type="password"
                      id="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      error={!!errors.newPassword}
                      helperText={errors.newPassword}
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
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                    />
                  </Grid>
                </Grid>
              </FormControl>

              <FormControl component="fieldset" sx={{ mt: 1, width: "100%" }}>
                <FormLabel
                  component="legend"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
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
                      name="employeeNumber"
                      label="Employee Number"
                      id="employeeNumber"
                      placeholder="e.g., EMP001"
                      value={formData.employeeNumber}
                      onChange={handleChange}
                      error={!!errors.employeeNumber}
                      helperText={errors.employeeNumber}
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
                      name="department"
                      label="Department"
                      id="department"
                      placeholder="e.g., Engineering"
                      value={formData.department}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="fullName"
                  label="Full Name"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                />
              </FormControl>
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
                  name="postalCode"
                  label="Postal Code"
                  id="postalCode"
                  placeholder="e.g., 100-0001"
                  value={formData.postalCode}
                  onChange={handleChange}
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
                  name="phoneNumber"
                  label="Phone Number"
                  id="phoneNumber"
                  placeholder="e.g., 090-1234-5678"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <TextField
              margin="normal"
              fullWidth
              name="address"
              label="Address"
              id="address"
              multiline
              rows={3}
              value={formData.address}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              fullWidth
              name="birthday"
              label="Birthday"
              id="birthday"
              placeholder="mm/dd/yyyy"
              value={formData.birthday}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              fullWidth
              name="notes"
              label="Notes"
              id="notes"
              placeholder="Additional information..."
              multiline
              rows={2}
              value={formData.notes}
              onChange={handleChange}
            />

            <Box sx={{ mt: 2 }}>
              <FormControl error={!!errors.agreeTerms}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    color="primary"
                  />
                  <Typography variant="body2">
                    I agree to the terms and conditions
                  </Typography>
                </Box>
                {errors.agreeTerms && (
                  <FormHelperText>{errors.agreeTerms}</FormHelperText>
                )}
              </FormControl>
            </Box>
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

        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography variant="h5" gutterBottom>
              Registration Complete
            </Typography>
            <Typography>
              Thank you for registering. Your account has been created
              successfully.
            </Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {getStepContent(activeStep)}

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button variant="contained">Complete Registration</Button>
              ) : (
                <Button variant="contained" onClick={handleNext}>
                  Continue
                </Button>
              )}
            </Box>
          </React.Fragment>
        )}
      </Paper>
    </Box>
  );
};

export default RegistrationForm;
