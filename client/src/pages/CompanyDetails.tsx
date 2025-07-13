import {
    Business,
    CalendarToday,
    Cancel,
    Check,
    Close,
    Delete,
    Edit,
    Email,
    Language,
    LocationOn,
    PendingActions,
    People,
    PersonAdd,
    Phone
} from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardMedia,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Snackbar,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';



interface Company {
  id: string;
  name: string;
  zipCode: string;
  address: string;
  phoneNumber: string;
  email: string;
  website?: string;
  establishmentDate: string;
  remarks?: string;
  images: string[];
  users: CompanyUser[];
  invitations: Invitation[];
}

interface CompanyUser {
  id: string;
  user: User;
}

interface User {
  id: string;
  email: string;
  role: Role;
  profile: Profile;
}

interface Profile {
  firstName: string;
  lastName: string;
  department: string;
  profileImage?: string;
}

interface Invitation {
  id: string;
  email: string;
  role: Role;
  status: InvitationStatus;
  expiresAt: string;
}

enum Role {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  MANAGER = 'MANAGER',
  GENERAL_EMPLOYEE = 'GENERAL_EMPLOYEE'
}

enum InvitationStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

const CompanyDetail: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Form state for invitation
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>(Role.GENERAL_EMPLOYEE);

  useEffect(() => {
    // Fetch company data from API
    const fetchCompany = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch(`/api/companies/${companyId}`);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockCompany: Company = {
          id: companyId || '1',
          name: 'Example Corporation',
          zipCode: '100-0001',
          address: 'Tokyo, Chiyoda-ku, 1-1-1',
          phoneNumber: '03-1234-5678',
          email: 'info@example.com',
          website: 'https://example.com',
          establishmentDate: '2000-01-01T00:00:00Z',
          remarks: 'This is a sample company for demonstration purposes.',
          images: [
            'https://via.placeholder.com/800x400?text=Company+Building',
            'https://via.placeholder.com/800x400?text=Office+Space'
          ],
          users: [
            {
              id: '1',
              user: {
                id: '1',
                email: 'admin@example.com',
                role: Role.SYSTEM_ADMIN,
                profile: {
                  firstName: 'John',
                  lastName: 'Doe',
                  department: 'Management',
                  profileImage: 'https://via.placeholder.com/150?text=JD'
                }
              }
            },
            {
              id: '2',
              user: {
                id: '2',
                email: 'manager@example.com',
                role: Role.MANAGER,
                profile: {
                  firstName: 'Jane',
                  lastName: 'Smith',
                  department: 'HR',
                  profileImage: 'https://via.placeholder.com/150?text=JS'
                }
              }
            }
          ],
          invitations: [
            {
              id: '1',
              email: 'newhire@example.com',
              role: Role.GENERAL_EMPLOYEE,
              status: InvitationStatus.PENDING,
              expiresAt: '2023-12-31T00:00:00Z'
            }
          ]
        };
        
        setCompany(mockCompany);
        setLoading(false);
      } catch (err) {
        setError('Failed to load company data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchCompany();
  }, [companyId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log('Tab changed to:', event);
    setActiveTab(newValue);
  };

  const handleInviteSubmit = async () => {
    try {
      // Replace with actual API call
      // await sendInvitation(companyId, inviteEmail, inviteRole);
      setSnackbarMessage('Invitation sent successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setOpenInviteDialog(false);
      // Refresh invitations list
    } catch  {
      setSnackbarMessage('Failed to send invitation');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteCompany = async () => {
    try {
      // Replace with actual API call
      // await deleteCompany(companyId);
      setSnackbarMessage('Company deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setOpenDeleteDialog(false);
      // Redirect to companies list
    } catch  {
      setSnackbarMessage('Failed to delete company');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case Role.SYSTEM_ADMIN: return 'error';
      case Role.MANAGER: return 'warning';
      case Role.GENERAL_EMPLOYEE: return 'primary';
      default: return 'default';
    }
  };

  const getInvitationStatusColor = (status: InvitationStatus) => {
    switch (status) {
      case InvitationStatus.PENDING: return 'warning';
      case InvitationStatus.COMPLETED: return 'success';
      case InvitationStatus.CANCELLED: return 'error';
      default: return 'default';
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!company) return <Typography>Company not found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with company name and actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          <Business sx={{ verticalAlign: 'middle', mr: 1 }} />
          {company.name}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            sx={{ mr: 2 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => setOpenDeleteDialog(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Company images carousel */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          {company.images.map((image, index) => (
            <Grid 
            size={{
                md:6,
                xs:12
            }}
            key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={image}
                  alt={`Company image ${index + 1}`}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Tabs for different sections */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Overview" icon={<Business />} />
          <Tab label="Employees" icon={<People />} />
          <Tab label="Invitations" icon={<PendingActions />} />
        </Tabs>
      </Box>

      {/* Tab content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Company details */}
          <Grid 
          size={{
            xs: 12,
            md: 6
          }}
          >
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Company Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  <Email sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Email
                </Typography>
                <Typography>{company.email}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  <Phone sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Phone
                </Typography>
                <Typography>{company.phoneNumber}</Typography>
              </Box>

              {company.website && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    <Language sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Website
                  </Typography>
                  <Typography>
                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                      {company.website}
                    </a>
                  </Typography>
                </Box>
              )}

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  <LocationOn sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Address
                </Typography>
                <Typography>
                  {company.zipCode} {company.address}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  <CalendarToday sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Establishment Date
                </Typography>
                <Typography>
                  {format(new Date(company.establishmentDate), 'MMMM d, yyyy')}
                </Typography>
              </Box>

              {company.remarks && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Remarks
                  </Typography>
                  <Typography>{company.remarks}</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Quick stats */}
          <Grid 
          size={{
            xs: 12,
            md: 6
          }}
          >
            <Grid container spacing={2}>
              <Grid 
                size={{
                    sm: 6,
                    md: 12
                }}
              >
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h5">{company.users.length}</Typography>
                  <Typography variant="subtitle2">Employees</Typography>
                </Paper>
              </Grid>
              <Grid 
              size={{
                sm: 6,
                md:12
              }}
              >
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h5">
                    {company.invitations.filter(i => i.status === InvitationStatus.PENDING).length}
                  </Typography>
                  <Typography variant="subtitle2">Pending Invitations</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Employees</Typography>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => setOpenInviteDialog(true)}
            >
              Invite Employee
            </Button>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <List>
            {company.users.map((companyUser) => (
              <React.Fragment key={companyUser.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={companyUser.user.profile.profileImage}>
                      {companyUser.user.profile.firstName.charAt(0)}{companyUser.user.profile.lastName.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${companyUser.user.profile.firstName} ${companyUser.user.profile.lastName}`}
                    secondary={
                      <>
                        {companyUser.user.email}
                        <Chip
                          label={companyUser.user.role.replace('_', ' ')}
                          size="small"
                          color={getRoleColor(companyUser.user.role)}
                          sx={{ ml: 1 }}
                        />
                        <Chip
                          label={companyUser.user.profile.department}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      </>
                    }
                  />
                  <IconButton edge="end">
                    <Edit />
                  </IconButton>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Invitations
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <List>
            {company.invitations.map((invitation) => (
              <React.Fragment key={invitation.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Email />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={invitation.email}
                    secondary={
                      <>
                        {format(new Date(invitation.expiresAt), 'MMMM d, yyyy')}
                        <Chip
                          label={invitation.role.replace('_', ' ')}
                          size="small"
                          color={getRoleColor(invitation.role)}
                          sx={{ ml: 1 }}
                        />
                        <Chip
                          label={invitation.status}
                          size="small"
                          color={getInvitationStatusColor(invitation.status)}
                          sx={{ ml: 1 }}
                        />
                      </>
                    }
                  />
                  {invitation.status === InvitationStatus.PENDING && (
                    <>
                      <IconButton edge="end" color="success">
                        <Check />
                      </IconButton>
                      <IconButton edge="end" color="error">
                        <Cancel />
                      </IconButton>
                    </>
                  )}
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Invite Dialog */}
      <Dialog open={openInviteDialog} onClose={() => setOpenInviteDialog(false)}>
        <DialogTitle>
          Invite New Employee
          <IconButton
            aria-label="close"
            onClick={() => setOpenInviteDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <TextField
            select
            margin="dense"
            label="Role"
            fullWidth
            variant="standard"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as Role)}
            SelectProps={{
              native: true,
            }}
          >
            {Object.values(Role).map((role) => (
              <option key={role} value={role}>
                {role.replace('_', ' ')}
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInviteDialog(false)}>Cancel</Button>
          <Button onClick={handleInviteSubmit} variant="contained">Send Invitation</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {company.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteCompany} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CompanyDetail;