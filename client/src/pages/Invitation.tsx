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

const Invitation = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const companies = [
    {
      email: "Demo Corporation",
      role: "Admin",
      status: "PENDING",
      invitedBy: "John Doe",
      date: "2023-10-01",
    },
    {
      email: "contact@techsolutions.com",
      role: "User",
      status: "ACCEPTED",
      invitedBy: "Jane Smith",
      date: "2023-09-15",
    },
  ];

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
                  <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.map((company, index) => (
                  <React.Fragment key={index}>
                    <TableRow hover>
                      <TableCell>
                        <Typography fontWeight="bold">
                          {company.email}
                        </Typography>
                      </TableCell>
                      <TableCell>{company.role || "-"}</TableCell>
                      <TableCell>{company.status || "-"}</TableCell>
                      <TableCell>{company.invitedBy || "-"}</TableCell>
                      <TableCell>{company.date || "-"}</TableCell>
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
