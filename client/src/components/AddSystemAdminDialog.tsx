import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "../hooks/useSnackbar";
import { useErrorHandler } from "../utils/handleApolloError";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Role } from "../utils/permissions";
import { SEND_INVITE_TO_ADMIN_MUTATION } from "../graphql/mutations/invitationMutations";

type AddSystemAdminDialogProps = {
  open: boolean;
  onClose: () => void;
};

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;

const AddSystemAdminDialog = ({ open, onClose }: AddSystemAdminDialogProps) => {
  const { handleGraphQLError } = useErrorHandler();
  const { showSnackbar } = useSnackbar();

  const [sendInvitation, { loading }] = useMutation(
    SEND_INVITE_TO_ADMIN_MUTATION
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await sendInvitation({
        variables: {
          input: {
            email: data.email,
            role: Role.SYSTEM_ADMIN,
            companyId: null,
          },
        },
      });
      showSnackbar("Invitation sent successfully", "success");
      reset();
      onClose();
    } catch (err) {
      handleGraphQLError(err, "Failed to send invitation.");
    }
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
        <FormControl sx={{ mt: 2 }} fullWidth error={!!errors.email}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                id="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                required
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
              />
            )}
          />
        </FormControl>

        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          The new administrator will receive an email with a registration URL
          and temporary password to complete their account setup.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ mt: 2 }}>
        <Button
          onClick={() => {
            reset();
            onClose();
          }}
          variant="outlined"
          color="secondary"
          sx={{ mr: 1 }}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          loading={loading}
          disabled={loading}
        >
          Invite Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSystemAdminDialog;
