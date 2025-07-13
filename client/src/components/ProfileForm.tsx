import { 
  Box, 
  Typography, 
  TextField, 
  Divider, 
  Button,
  Paper,
  Grid
} from '@mui/material';

const EmployeeProfileForm = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight={'bold'}>
        My Profile
      </Typography>
      <Typography variant="subtitle1"
      color='text.secondary'
      gutterBottom sx={{ mb: 3 }}>
        Manage your personal information and employee details
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Employee Profile
        </Typography>
        <Typography variant="subtitle2"
        color='text.secondary'
        gutterBottom sx={{ mb: 3 }}>
          Update your personal and professional information
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
          Account Information
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={6}>
           <TextField
              fullWidth
                label="Email Address *"
                variant="outlined"
                margin="normal"
                value="admin@system.com"
                InputProps={{
                  disabled: true,
                }}
              />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Role *"
              variant="outlined"
              margin="normal"
              value="Administrator"
              InputProps={{
                disabled: true,
              }}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
          Employee Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Employee Number *"
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Department"
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Full Name *"
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Postal Code"
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid      size={12}>
            <TextField
              fullWidth
              label="Birthday"
              variant="outlined"
              margin="normal"
              placeholder="mm/dd/yyyy"
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Notes"
              variant="outlined"
              margin="normal"
              multiline
              rows={4}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="contained" color="primary">
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmployeeProfileForm;