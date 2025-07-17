import {
    Business,
    CalendarToday,
    Close,
    Description,
    Email,
    Language,
    LocationOn,
    Phone
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    Tab,
    Tabs,
    Typography,
    useTheme
} from '@mui/material';
import React from 'react';
import type { CompanyDTO } from '../types/graphql/Company';

interface CompanyDetailDialogProps {
  open: boolean;
  onClose: () => void;
  company: CompanyDTO | null;
  loading?: boolean;
}

const CompanyDetailDialog: React.FC<CompanyDetailDialogProps> = ({
  open,
  onClose,
  company,
  loading,
}) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log('Tab changed to:', event);
    setTabValue(newValue);
  };

  if(loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Loading...</DialogTitle>
        <DialogContent>
          <Box width={40} height={40} sx={{ textAlign: 'center', p: 2 }}>
            <CircularProgress size={40} />
            <Typography>Loading company details...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if(company === null) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography color="error">Company not found.</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          height: '80vh',
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
              <Business fontSize="medium" />
            </Avatar>
            <Typography variant="h6">{company.name}</Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Overview" icon={<Business />} iconPosition="start" />
            <Tab label="Details" icon={<Description />} iconPosition="start" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3, height: 'calc(100% - 48px)', overflow: 'auto' }}>
          {tabValue === 0 && (
            <Grid container spacing={3}>
              {/* Left Column - Basic Info */}
              <Grid size={{
                xs:12,
                md:6
              }}>
                <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Basic Information
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      icon={<CalendarToday />}
                    label={`Established: ${new Date(company.establishmentDate).toLocaleDateString()}`}
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                  </Box>

                  <InfoItem icon={<Email />} title="Email" value={company.email} />
                  <InfoItem icon={<Phone />} title="Phone" value={company.phoneNumber} />
                  <InfoItem
                    icon={<LocationOn />}
                    title="Address"
                    value={
                      <>
                        〒{company.postalCode}
                        <br />
                        {company.address}
                      </>
                    }
                  />
                  {company.website && (
                    <InfoItem
                      icon={<Language />}
                      title="Website"
                      value={
                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                          {company.website}
                        </a>
                      }
                    />
                  )}
                </Paper>
              </Grid>

              {/* Right Column - Images */}
              <Grid size={{
                xs:12,
                md:6
              }}>
                {company.images && company.images.length > 0 && (
                  <Paper elevation={0} sx={{ p: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Company Images
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {company.images.map((image, index) => (
                        <Paper
                          key={index}
                          elevation={2}
                          sx={{
                            width: 120,
                            height: 120,
                            borderRadius: 1,
                            overflow: 'hidden',
                            backgroundImage: `url(${image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>
                )}
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Additional Details
              </Typography>
              <Paper elevation={0} sx={{ p: 3 }}>
                {company.remarks ? (
                  <Typography>{company.remarks}</Typography>
                ) : (
                  <Typography color="textSecondary">No additional remarks</Typography>
                )}
              </Paper>
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* <DialogActions sx={{ p: 2 }}>
        <Button
          startIcon={<Share />}
          onClick={() => console.log('Share company')}
        >
          Share
        </Button>
        <Button
          startIcon={<Edit />}
          onClick={onEdit}
          variant="contained"
          color="primary"
        >
          Edit
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

// Helper component for consistent info items
const InfoItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}> = ({ icon, title, value }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="subtitle2"
        sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
      >
        {React.cloneElement(icon as React.ReactElement, {
          // sx: { mr: 1, fontSize: '1rem', color: 'text.secondary' },
        })}
        {title}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );
};

export default CompanyDetailDialog;