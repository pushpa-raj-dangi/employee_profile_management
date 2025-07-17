import NotInterestedIcon from "@mui/icons-material/NotInterested";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import PageSubHeader from "../components/PageSubHeader";
import UserInvitationDialog from "../components/UserInvitationDialog";
import { LIST_INVITATIONS } from "../graphql/queries/invitationQueries";
import { useMutation, useQuery } from "@apollo/client";
import type { InvitationResponse } from "../types/graphql/Invitation";
import { useSnackbar } from "../hooks/useSnackbar";
import { CANCEL_INVITATION } from "../graphql/mutations/invitationMutations";
import StatusChip from "../components/StatusChip";

const Invitation = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {showSnackbar} = useSnackbar();
  const [id, setId] = useState<string>("");

  const { loading, error, refetch, data } = useQuery<{
    listInvitations: InvitationResponse[];
  }>(LIST_INVITATIONS, {
    fetchPolicy: "network-only",
  });



  const [cancelInvitation, { loading:cancelling }] = useMutation(CANCEL_INVITATION, {
    variables: { id },
    onCompleted: (data) => {
      if (data.cancelInvitation) {
        showSnackbar("Invitation cancelled successfully.", "success");
      } else {
        showSnackbar("Failed to cancel invitation.", "error");
      }
    },
    onError: (error) => {
      showSnackbar(error.message, "error");
    },
  });


  const handleCancelInvitation = (id: string) => {
    const confirmation = window.confirm(
      "Are you sure you want to cancel this invitation? This action cannot be undone."
    );
    if (!confirmation) return;

    setId(id);

    cancelInvitation({ variables: { id } });
    refetch();
  }


  


  if (loading)
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <p>Error loading invitations: {error.message}</p>;

  return (
    <Box>
      <PageHeader
        title="Invitations"
        subtitle="Manage user invitations and account creation"
        buttonText="Send New Invitation"
        onButtonClick={() => setDialogOpen(true)}
      />
      <Box
        sx={{ mb: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: "8px" }}
      >
        <PageSubHeader
          title="Invitation History"
          subtitle="Track sent invitations and their status"
          icon={<PersonAddAltIcon />}
        />

        <Paper elevation={0} sx={{ overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Invited By</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.listInvitations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography>No invitations found.</Typography>
                    </TableCell>
                  </TableRow>
                )}
                {data?.listInvitations.map((invitation) => (
                  <React.Fragment key={invitation.id}>
                    <TableRow hover>
                      <TableCell>
                        <Typography fontWeight="bold">
                          {invitation.email}
                        </Typography>
                      </TableCell>
                      <TableCell>{invitation.role || "-"}</TableCell>
                      <TableCell>

                        <StatusChip
                          status={invitation.status as "PENDING" | "COMPLETED" | "CANCELLED"}
                        />
                      </TableCell>
                      <TableCell>
                        {invitation.invitedBy?.email || "-"}
                      </TableCell>
                      {invitation.status === "PENDING" ? (
                        <TableCell>
                          <Button
                          loading={cancelling}
                            onClick={() => handleCancelInvitation(invitation.id)}
                            color="error"
                            startIcon={<NotInterestedIcon />}
                          ></Button>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      <UserInvitationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </Box>
  );
};

export default Invitation;
