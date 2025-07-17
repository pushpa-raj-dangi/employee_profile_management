import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { CloudUpload } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useNavigate } from "react-router";
import { UPDATE_PROFILE_MUTATION } from "../graphql/mutations/userMutations";
import { useAuth } from "../hooks/useAuth";
import { profileSchema, type ProfileFormData } from "../schemas/schema";
import { useSnackbar } from "../hooks/useSnackbar";

interface EmployeeProfileFormProps {
  initialData?: ProfileFormData;
}

const EmployeeProfileForm: React.FC<EmployeeProfileFormProps> = ({
  initialData,
}) => {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [updateProfile, { loading, error }] = useMutation(
    UPDATE_PROFILE_MUTATION
  );

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
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
      postalCode: "",
      address: "",
      phoneNumber: "",
      birthday: new Date(),
      remarks: "",
      profileImage: "",
      userId: user?.id || "",
    },
  });

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
      showSnackbar("Profile updated successfully", "success");
      reset(data);
      navigate("/profile");
    } catch (err) {
      console.error("Profile update error:", err);
      showSnackbar(`Error updating profile: ${error!["message"]}`, "error");
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
          <Controller
            name="userId"
            control={control}
            render={({ field }) => <input {...field} type="hidden" />}
          />

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            Profile Details
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
                name="postalCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Zip Code *"
                    variant="outlined"
                    margin="normal"
                    error={!!errors.postalCode}
                    helperText={errors.postalCode?.message}
                    inputProps={{ maxLength: 7 }}
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
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default EmployeeProfileForm;
