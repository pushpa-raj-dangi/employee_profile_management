import NotInterestedIcon from "@mui/icons-material/NotInterested";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import {
  Box,
  Button,
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
import type { InvitationResponse } from "../types/graphql/invitation";
import { LIST_INVITATIONS } from "../graphql/queries/invitationQueries";
import { useQuery } from "@apollo/client";

const Invitation = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { loading, error, data } = useQuery<{
    listInvitations: InvitationResponse[];
  }>(LIST_INVITATIONS);

  if (loading) return <p>Loading invitations...</p>;
  if (error) return <p>Error loading invitations: {error.message}</p>;

  if (!data || data.listInvitations.length === 0) {
    return <p>No invitations found.</p>;
  }

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
                {data.listInvitations.map((invitation) => (
                  <React.Fragment key={invitation.id}>
                    <TableRow hover>
                      <TableCell>
                        <Typography fontWeight="bold">
                          {invitation.email}
                        </Typography>
                      </TableCell>
                      <TableCell>{invitation.role || "-"}</TableCell>
                      <TableCell>{invitation.status || "-"}</TableCell>
                      <TableCell>{invitation.invitedBy?.fullName || "-"}</TableCell>
                      <TableCell>
                        <Button
                          color="error"
                          startIcon={<NotInterestedIcon />}
                        ></Button>
                      </TableCell>
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
