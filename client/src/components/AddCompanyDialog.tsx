import { useState } from "react";
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

type AddCompanyDialogProps = {
  open: boolean;
  onClose: () => void;
};

const AddCompanyDialog = ({ open, onClose }: AddCompanyDialogProps) => {
  const [formData, setFormData] = useState({
    companyName: "",
    companyNameKana: "",
    postalCode: "",
    phoneNumber: "",
    address: "",
    email: "",
    websiteUrl: "",
    establishmentDate: null,
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(
      (prev) => ({ ...prev, establishmentDate: date }) as typeof formData
    );
  };

  const handleSubmit = () => {
    console.log(formData);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" flexDirection="column">
            <Typography variant="h6">Add New Company</Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Create a new company profile
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="companyName"
                label="Company Name"
                fullWidth
                variant="filled"
                required
                value={formData.companyName}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="companyNameKana"
                label="Company Name (Kana)"
                fullWidth
                variant="filled"
                value={formData.companyNameKana}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="postalCode"
                label="Postal Code"
                fullWidth
                variant="filled"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="phoneNumber"
                label="Phone Number"
                fullWidth
                variant="filled"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                name="address"
                label="Address"
                fullWidth
                variant="filled"
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                variant="filled"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="websiteUrl"
                label="Website URL"
                fullWidth
                variant="filled"
                value={formData.websiteUrl}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker
                label="Establishment Date"
                value={formData.establishmentDate}
                onChange={handleDateChange}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                name="notes"
                label="Notes"
                fullWidth
                variant="filled"
                multiline
                rows={3}
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.companyName}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AddCompanyDialog;
