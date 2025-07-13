import { Email } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { Company } from "../types/graphql/Company";
import CompanySelector from "./CompanySelector";

type UserInvitationDialogProps = {
  open: boolean;
  onClose: () => void;
};

const UserInvitationDialog = ({ open, onClose }: UserInvitationDialogProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Administrative User");
  const [sendCredentials] = useState(true);

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleSubmit = () => {
    console.log({ email, role, sendCredentials });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" flexDirection="column">
          <Typography variant="h6">Send User Invitation</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Invite a new user to join the system
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mt: 2 }}
        />

        <TextField
          select
          margin="dense"
          id="role"
          label="Role"
          fullWidth
          variant="outlined"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          sx={{ mt: 2, mb: 2 }}
        >
          <MenuItem value="Administrative User">Administrative User</MenuItem>
          <MenuItem value="Regular User">Regular User</MenuItem>
          <MenuItem value="Read-only User">Read-only User</MenuItem>
        </TextField>
        <CompanySelector
          value={selectedCompany}
          onChange={setSelectedCompany}
          label="Select Company"
        />
        <Box
          sx={{
            display: "flex",
            border: ".5px solid #ccc",
            p: 2,
            borderRadius: "8px",
            gap: 1,
            alignItems: "center",
            mt: 2,
          }}
        >
          <Email />
          <Typography variant="body1" color="text.secondary">
            The user will receive an email invitation to join the system.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!email}>
          Send Invitation
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserInvitationDialog;
