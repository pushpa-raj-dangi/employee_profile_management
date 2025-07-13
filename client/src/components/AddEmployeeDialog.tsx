import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import CompanySelector from "./CompanySelector";

const employeeSchema = z.object({
  employeeNumber1: z.string().min(1, "Employee number is required"),
  employeeNumber2: z.string().optional(),
  fullName: z.string().min(1, "Full name is required"),
  companyId: z.string().min(1, "Company is required"),
  postalCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  birthday: z.date().nullable().optional(),
  notes: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

type AddEmployeeDialogProps = {
  open: boolean;
  onClose: () => void;
};

const AddEmployeeDialog = ({ open, onClose }: AddEmployeeDialogProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employeeNumber1: "",
      employeeNumber2: "",
      fullName: "",
      companyId: "",
      postalCode: "",
      phoneNumber: "",
      address: "",
      birthday: null,
      notes: "",
    },
  });

  const onSubmit = (data: EmployeeFormData) => {
    console.log(data);
    onClose();
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" flexDirection="column">
          <Typography variant="h6">Add New Employee</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Create a new employee profile
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid size={12}>
            <Typography variant="subtitle2" gutterBottom>
              Employee Number *
            </Typography>
            <Controller
              name="employeeNumber1"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  placeholder="e.g. 123456"
                  error={!!errors.employeeNumber1}
                  helperText={errors.employeeNumber1?.message}
                  required
                />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Full Name *"
                  variant="outlined"
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                  required
                />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              name="companyId"
              control={control}
              render={({ field }) => (
                <CompanySelector
                  {...field}
                  value={field.value ? { id: field.value, name: "" } : null}
                  onChange={field.onChange}
                  label="Company *"
                  error={!!errors.companyId}
                  helperText={errors.companyId?.message}
                />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              name="postalCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Postal Code"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Address"
                  variant="outlined"
                  multiline
                  rows={3}
                />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              name="birthday"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Birthday"
                    value={field.value}
                    onChange={field.onChange}
                   
                  />
                </LocalizationProvider>
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Notes"
                  variant="outlined"
                  multiline
                  rows={3}
                />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit(onSubmit)} 
          color="primary" 
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeDialog;