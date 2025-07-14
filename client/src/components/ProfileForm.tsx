import React, { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
  Box,
  Typography,
  TextField,
  Divider,
  Button,
  Paper,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Avatar,
  IconButton,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { CloudUpload } from "@mui/icons-material";
import { profileSchema, type ProfileFormData } from "../schema";
import { useAuth } from "../hooks/useAuth";
import { UPDATE_PROFILE_MUTATION } from "../graphql/mutations/userMutations";
import { useNavigate } from "react-router";

interface EmployeeProfileFormProps {
  initialData?: ProfileFormData;
}

const EmployeeProfileForm: React.FC<EmployeeProfileFormProps> = ({
  initialData,
}) => {
  const { user } = useAuth();
  const [updateProfile, { loading, error }] = useMutation(
    UPDATE_PROFILE_MUTATION
  );

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      employeeNumber: "",
      department: "",
      firstName: "",
      lastName: "",
      zipCode: "",
      address: "",
      phoneNumber: "",
      birthday: new Date(),
      remarks: "",
      profileImage: "",
    },
  });

  const [successMessage, setSuccessMessage] = React.useState("");
  const profileImage = watch("profileImage");

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        birthday: initialData.birthday
          ? new Date(initialData.birthday)
          : new Date(),
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile({
        variables: {
          input: {
            ...data,
            birthday: data.birthday.toISOString(),
          },
        },
      });
      setSuccessMessage("Profile updated successfully");
      reset(data);
      navigate("/profile");
    } catch (err) {
      console.error("Profile update error:", err);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue("profileImage", base64String, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Typography variant="h4" fontWeight="bold">
          My Profile
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          gutterBottom
          sx={{ mb: 3 }}
        >
          Manage your personal information and employee details
        </Typography>

        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Employee Profile
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
            sx={{ mb: 3 }}
          >
            Update your personal and professional information
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={profileImage || "/default-avatar.png"}
                sx={{ width: 120, height: 120 }}
              />
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                <CloudUpload />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </IconButton>
            </Box>
          </Box>

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            Account Information
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                margin="normal"
                value={user?.email || ""}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <TextField
                fullWidth
                label="Role"
                variant="outlined"
                margin="normal"
                value={user?.role || ""}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            Employee Details
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Controller
                name="employeeNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Employee Number *"
                    variant="outlined"
                    margin="normal"
                    error={!!errors.employeeNumber}
                    helperText={errors.employeeNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Department *"
                    variant="outlined"
                    margin="normal"
                    error={!!errors.department}
                    helperText={errors.department?.message}
                  />
                )}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="First Name *"
                    variant="outlined"
                    margin="normal"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name *"
                    variant="outlined"
                    margin="normal"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Controller
                name="zipCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Zip Code *"
                    variant="outlined"
                    margin="normal"
                    error={!!errors.zipCode}
                    helperText={errors.zipCode?.message}
                    inputProps={{ maxLength: 4 }}
                  />
                )}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Phone Number *"
                    variant="outlined"
                    margin="normal"
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Address *"
                    variant="outlined"
                    margin="normal"
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Controller
                name="birthday"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Birthday *"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: "normal",
                        error: !!errors.birthday,
                        helperText: errors.birthday?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <Controller
                name="remarks"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Remarks"
                    variant="outlined"
                    margin="normal"
                    multiline
                    rows={4}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !isDirty}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => {}}>
        <Alert severity="error">
          {error?.message || "Failed to update profile"}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default EmployeeProfileForm;
