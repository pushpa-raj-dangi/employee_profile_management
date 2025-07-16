import { useMutation, useQuery } from "@apollo/client";
import { Factory } from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddCompanyDialog from "../components/AddCompanyDialog";
import PageHeader from "../components/PageHeader";
import PageSubHeader from "../components/PageSubHeader";
import { CREATE_COMPANY_MUTATION } from "../graphql/mutations/companyMutations";
import { GET_COMPANIES_FULL } from "../graphql/queries/companyQueries";
import { useSnackbar } from "../hooks/useSnackbar";
import type {
  CompanyFormData,
  CreateCompanyInput,
} from "../schemas/company/createCompanySchema";
import type { CompanyDTO } from "../types/graphql/Company";

const Company = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { showSnackbar } = useSnackbar();

  const [createCompany, { loading: creating, error: createError }] =
    useMutation<
      {
        createCompany: CompanyDTO;
      },
      {
        input: CreateCompanyInput;
      }
    >(CREATE_COMPANY_MUTATION);

  const { loading, error, data } = useQuery<{
    companies: CompanyDTO[];
  }>(GET_COMPANIES_FULL);

  const companies = data?.companies || [];

  const handleSubmit = async (formData: CompanyFormData) => {
    try {
      await createCompany({ variables: { input: formData } });
      setIsOpen(false);
      showSnackbar("Company created successfully", "success");
    } catch (error) {
      showSnackbar(`Error creating company: ${error}`, "error");
    }
  };

  useEffect(() => {
    if (createError) {
      showSnackbar(`Error creating company: ${createError.message}`, "error");
    }
  }, [createError, showSnackbar]);


  if (creating) return <CircularProgress />;

  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Alert severity="error">Error loading companies: {error.message}</Alert>
    );

  return (
    <Box>
      <PageHeader
        title="Companies"
        subtitle="Manage company information and settings"
        buttonText="Add New Company"
        onButtonClick={() => setIsOpen(true)}
        allowedRoles={["SYSTEM_ADMIN"]}
      />
      <Box
        sx={{ mb: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: "8px" }}
      >
        <PageSubHeader
          title="Company Directory"
          subtitle="All registered companies in the system"
          icon={<Factory />}
        />

        <Paper elevation={0} sx={{ overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Company Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Established</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.map((company: CompanyDTO) => (
                  <React.Fragment key={company.id}>
                    <TableRow hover>
                      <TableCell>
                        <Typography fontWeight="bold">
                          {company.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{company.email || "-"}</TableCell>
                      <TableCell>{company.phoneNumber || "-"}</TableCell>
                      <TableCell>
                        {new Date(
                          company.establishmentDate
                        ).toLocaleDateString() || "-"}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Details">
                          <IconButton size="small">
                            <InfoIcon color="info" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      <AddCompanyDialog
        onSubmit={handleSubmit}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </Box>
  );
};

export default Company;
