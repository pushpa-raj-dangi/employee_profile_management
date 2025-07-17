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
import { useAuth } from "../hooks/useAuth";
import { invitationSchema } from "../schemas/invitations";
import type { Company } from "../types/graphql/Company";
import { Role } from "../utils/permissions";
import CompanySelector from "./CompanySelector";
import { SEND_INVITATION_MUTATION } from "../graphql/mutations/invitationMutations";
import { useMutation } from "@apollo/client";
import { useSnackbar } from "../hooks/useSnackbar";
import { useErrorHandler } from "../utils/handleApolloError";

type UserInvitationDialogProps = {
  open: boolean;
  onClose: () => void;
};

const UserInvitationDialog = ({ open, onClose }: UserInvitationDialogProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const [errors, setErrors] = useState<{ email?: string }>({});
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  const { handleGraphQLError } = useErrorHandler();

  const allRoles = [Role.GENERAL_EMPLOYEE, Role.SYSTEM_ADMIN, Role.MANAGER];

  const visibleRoles =
    user?.role === Role.MANAGER
      ? allRoles.filter((r) => r !== Role.SYSTEM_ADMIN)
      : allRoles;

  const [sendInvitation,{ loading }] = useMutation(SEND_INVITATION_MUTATION);

  const handleSubmit = async () => {
    const result = invitationSchema.safeParse({
      email,
      role,
      companyId: selectedCompany?.id ?? "",
    });

    if (!result.success) {
      const formatted = result.error.format();
      setErrors({
        email: formatted.email?._errors?.[0],
      });
      return;
    }

    try {
      const response = await sendInvitation({
        variables: {
          input: {
            email,
            role,
            companyId: selectedCompany?.id ?? "",
          },
        },
      });

      if (response.data?.sendInvitation) {
        showSnackbar("Invitation sent successfully", "success");
      } else {
        showSnackbar("Failed to send invitation", "error");
      }
    } catch (error) {
      handleGraphQLError(error, "Failed to send invitation.");
    }

    setErrors({});
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
          error={Boolean(errors.email)}
          helperText={errors.email}
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
          {visibleRoles.map((roleOption) => (
            <MenuItem key={roleOption} value={roleOption}>
              {roleOption}
            </MenuItem>
          ))}
        </TextField>

        {user?.role === Role.MANAGER && (
          <CompanySelector
            value={selectedCompany}
            onChange={setSelectedCompany}
            label="Select Company"
          />
        )}
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
        <Button onClick={handleSubmit}
        loading={loading}
        variant="contained">
          Send Invitation
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserInvitationDialog;
