import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Controller } from "react-hook-form";
import { companySchema, type CompanyFormData } from "../schemas/company/createCompanySchema";
import { useEffect } from "react";

type CompanyDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CompanyFormData) => void;
  defaultValues?: Partial<CompanyFormData>;
  isEdit?: boolean;
};

const CompanyDialog = ({
  open,
  onClose,
  onSubmit,
  defaultValues,
  isEdit = false,
}: CompanyDialogProps) => {
  const {
    control,
    handleSubmit,
    trigger,
    register,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(companySchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      postalCode: "",
      address: "",
      phoneNumber: "",
      email: "",
      website: "",
      establishmentDate: undefined,
      remarks: "",
      ...defaultValues,
    },
  });

  console.log("CompanyDialog defaultValues:", defaultValues);

useEffect(() => {
  if (defaultValues) {
    const clonedDefaults = {
      ...defaultValues,
      establishmentDate: defaultValues.establishmentDate
        ? new Date(defaultValues.establishmentDate)
        : undefined,
    };
    reset(clonedDefaults);
  }
      trigger(); 
}, [defaultValues, reset, trigger]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" flexDirection="column">
            <Typography variant="h6">
              {isEdit ? "Edit Company" : "Add New Company"}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {isEdit ? "Update company profile" : "Create a new company profile"}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid
                size={{
                  xs:12,
                  sm:6
                }}
              >
                <TextField
                  {...register("name")}
                  label="Company Name"
                  fullWidth
                  variant="filled"
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>

              <Grid
                size={{
                  xs:12,
                  sm:6
                }}
              >
                <TextField
                  {...register("postalCode")}
                  label="Postal Code"
                  fullWidth
                  variant="filled"
                  required
                  error={!!errors.postalCode}
                  helperText={errors.postalCode?.message}
                />
              </Grid>
              <Grid
                size={{
                  xs:12,
                  sm:6
                }}
              >
                <TextField
                  {...register("phoneNumber")}
                  label="Phone Number"
                  fullWidth
                  variant="filled"
                  required
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                />
              </Grid>

              <Grid size={{xs:12}}>
                <TextField
                  {...register("address")}
                  label="Address"
                  fullWidth
                  variant="filled"
                  multiline
                  rows={2}
                  required
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              </Grid>

              <Grid
                size={{
                  xs:12,
                  sm:6
                }}
              >
                <TextField
                  {...register("email")}
                  label="Email"
                  fullWidth
                  variant="filled"
                  type="email"
                  required
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid
                size={{
                  xs:12,
                  sm:6
                }}
              >
                <TextField
                  {...register("website")}
                  label="Website URL"
                  fullWidth
                  variant="filled"
                  error={!!errors.website}
                  helperText={errors.website?.message}
                />
              </Grid>

              <Grid
                size={{
                  xs:12,
                  sm:6
                }}
              >
                <Controller
                  name="establishmentDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Establishment Date"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          variant: "filled",
                          fullWidth: true,
                          error: !!errors.establishmentDate,
                          helperText: errors.establishmentDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{xs:12}}>
                <TextField
                  {...register("remarks")}
                  label="Notes"
                  fullWidth
                  variant="filled"
                  multiline
                  rows={3}
                  error={!!errors.remarks}
                  helperText={errors.remarks?.message}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={!isValid}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default CompanyDialog;