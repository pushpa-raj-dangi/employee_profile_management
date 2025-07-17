import { Edit, PeopleAlt } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TablePagination,
  Typography,
} from "@mui/material";
import PageHeader from "../components/PageHeader";
import PageSubHeader from "../components/PageSubHeader";
import AddEmployeeDialog from "../components/AddEmployeeDialog";
import { useEffect, useState, type FC } from "react";
import { useQuery } from "@apollo/client";
import { LIST_EMPLOYEES } from "../graphql/queries/employeeQueries";
import type { User } from "../types/graphql/User";
import { Link } from "react-router";

interface ListEmployeesResponse {
  listEmployees: {
    data: User[];
    totalCount: number;
  };
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

const Employee: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: ROWS_PER_PAGE_OPTIONS[1],
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPagination((prev) => ({ ...prev, page: 0 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, loading, error } = useQuery<ListEmployeesResponse>(
    LIST_EMPLOYEES,
    {
      variables: {
        searchTerm: debouncedSearchTerm,
        skip: pagination.page * pagination.rowsPerPage,
        take: pagination.rowsPerPage,
      },
      fetchPolicy: "network-only",
    }
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    console.log("Changing page to:", event);
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPagination({
      page: 0,
      rowsPerPage: parseInt(event.target.value, 10),
    });
  };

  if (loading && !data) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <Typography color="error">{error.message}</Typography>;

  return (
    <Box>
      <PageHeader
        title="Employees"
        subtitle="Manage employee information and settings"
        buttonText="Add New Employee"
        onButtonClick={() => setOpen(true)}
      />
      <Box
        sx={{ mb: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: "8px" }}
      >
        <PageSubHeader
          title="Employee Directory"
          subtitle={`${data?.listEmployees.totalCount || 0} employees found`}
          icon={<PeopleAlt />}
        />

        <TextField
          fullWidth
          placeholder="Search employees..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Paper elevation={0} sx={{ overflow: "hidden", mb: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.listEmployees.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No employees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.listEmployees.data.map((employee) => (
                    <TableRow hover key={employee.id}>
                      <TableCell>
                        {employee.profile?.firstName || '-'}
                        {employee.profile?.lastName}
                      </TableCell>
                      <TableCell>{employee.email || '-'}</TableCell>
                      <TableCell>
                        {employee.isActive ? (
                          <Box display="flex" alignItems="center">
                            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                            <Typography variant="body2">Active</Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            Inactive
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{employee.companyName || "-"}</TableCell>
                      <TableCell>
                        {/* Placeholder for action buttons */}
                        <IconButton size="small">
                          {/* Add edit icon here */}
                          <Link
                          to={`/profile/${employee.id}`}
                          >
                          <Edit
                          /></Link>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            component="div"
            count={data?.listEmployees.totalCount || 0}
            rowsPerPage={pagination.rowsPerPage}
            page={pagination.page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: "1px solid rgba(224, 224, 224, 1)",
            }}
          />
        </Paper>
      </Box>
      {
        open && (
          <AddEmployeeDialog open={open} onClose={() => setOpen(false)} />
        )
      }
    </Box>
  );
};

export default Employee;
