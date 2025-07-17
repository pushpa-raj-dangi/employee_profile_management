import { useMutation, useQuery } from "@apollo/client";
import { Factory, Visibility } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
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
  Typography,
} from "@mui/material";
import { useState } from "react";
import RoleBased from "../auth/RoleBased";
import AddCompanyDialog from "../components/AddCompanyDialog";
import CompanyDetailDialog from "../components/CompanyDetailDialog";
import PageHeader from "../components/PageHeader";
import PageSubHeader from "../components/PageSubHeader";
import {
  CREATE_COMPANY_MUTATION,
  UPDATE_COMPANY_MUTATION,
} from "../graphql/mutations/companyMutations";
import {
  GET_COMPANIES_FULL,
  GET_COMPANY_BY_ID,
} from "../graphql/queries/companyQueries";
import { useSnackbar } from "../hooks/useSnackbar";
import type {
  CompanyFormData,
  CreateCompanyInput,
} from "../schemas/company/createCompanySchema";
import type { CompanyDTO } from "../types/graphql/Company";

const Company = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [isViewCompanyDialog, setIsViewCompanyDialog] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );

  const [createCompany, { loading: creating }] = useMutation<
    {
      createCompany: CompanyDTO;
    },
    {
      input: CreateCompanyInput;
    }
  >(CREATE_COMPANY_MUTATION);

  const { loading, error, data, refetch } = useQuery<{
    companies: CompanyDTO[];
  }>(GET_COMPANIES_FULL, {
    fetchPolicy: "network-only",
  });

  const { data: companyDetail, loading: companyDetailLoading } = useQuery<{
    company: CompanyDTO;
  }>(GET_COMPANY_BY_ID, {
    variables: { id: selectedCompanyId || "" },
    skip: !selectedCompanyId,
    fetchPolicy: "network-only",
  });

  const [updateCompany] = useMutation(UPDATE_COMPANY_MUTATION);

  const companies = data?.companies || [];

  const handleSubmit = async (formData: CompanyFormData) => {
    try {
      if (selectedCompanyId) {
        await updateCompany({
          variables: {
            input: {
              id: selectedCompanyId,
              ...formData,
            },
          },
        });
        showSnackbar("Company updated successfully", "success");
      } else {
        await createCompany({ variables: { input: formData } });
        showSnackbar("Company created successfully", "success");
      }
    } catch (error) {
      showSnackbar(`Error creating company: ${error}`, "error");
    }
    await refetch();
    setIsOpen(false);
    setSelectedCompanyId(null);
  };

  const handleViewCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setIsViewCompanyDialog(true);
  };

  const handleEditCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setIsOpen(true);
  };

  if (loading || creating) return <CircularProgress />;
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
                {companies.map((company) => (
                  <TableRow hover key={company.id}>
                    <TableCell>
                      <Typography fontWeight="bold">{company.name}</Typography>
                    </TableCell>
                    <TableCell>{company.email || "-"}</TableCell>
                    <TableCell>{company.phoneNumber || "-"}</TableCell>
                    <TableCell>
                      {new Date(
                        company.establishmentDate
                      ).toLocaleDateString() || "-"}
                    </TableCell>
                    <TableCell>
                      <RoleBased allowed={["SYSTEM_ADMIN", "MANAGER"]}>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleEditCompany(company.id)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </RoleBased>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewCompany(company.id)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {isOpen && (
        <AddCompanyDialog
          onSubmit={handleSubmit}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          isEdit={!!selectedCompanyId}
          defaultValues={selectedCompanyId ? companyDetail?.company : undefined}
        />
      )}

      {isViewCompanyDialog && (
        <CompanyDetailDialog
          open={isViewCompanyDialog}
          onClose={() => {
            setIsViewCompanyDialog(false);
            setSelectedCompanyId(null);
          }}
          company={companyDetail?.company || null}
          loading={companyDetailLoading}
        />
      )}
    </Box>
  );
};

export default Company;
