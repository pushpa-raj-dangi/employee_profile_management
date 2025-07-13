import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { SEND_INVITE_USER_MUTATION } from "../graphql/mutations/sendInviteMutations";

type AddSystemAdminDialogProps = {
  open: boolean;
  onClose: () => void;
};

const AddSystemAdminDialog = ({ open, onClose }: AddSystemAdminDialogProps) => {
  const [email, setEmail] = useState("");
  const [emailError] = useState("");

  const [sendInvitation, { loading }] = useMutation(SEND_INVITE_USER_MUTATION);

  const handleSubmit = async () => {
    try {
      await sendInvitation({
        variables: {
          input: {
            email,
            role: "SYSTEM_ADMIN",
            companyId: "c4a7e7d1-7e22-42de-8e48-0cbb61260406",
          },
        },
      });
    } catch (err) {
      console.error("Error sending invitation:", err);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" flexDirection="column">
          <Typography variant="h6">Create System Administrator</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Create a new system administrator account. A registration email will
            be sent with temporary credentials.
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <FormControl sx={{ mt: 2 }} fullWidth error={!!emailError}>
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
          />
          {emailError && <FormHelperText>{emailError}</FormHelperText>}
        </FormControl>

       

        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          The new administrator will receive an email with a registration URL
          and temporary password to complete their account setup.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ mt: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} loading={loading} variant="contained">
          Create & Send Email
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSystemAdminDialog;
