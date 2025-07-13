import React from 'react';
import { useQuery } from '@apollo/client';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import type { Company } from '../types/graphql/Company';
import { GET_COMPANIES_MINIMAL } from '../graphql/queries/companyQueries';


interface CompanySelectorProps {
  value: Company | null;
  onChange: (company: Company | null) => void;
  disabled?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({
  value,
  onChange,
  disabled = false,
  label = 'Company',
  error = false,
  helperText = '',
}) => {
  const { loading, data, error: queryError } = useQuery<{ companies: Company[] }>(GET_COMPANIES_MINIMAL);

  const companies = data?.companies || [];

  return (
    <Autocomplete
      options={companies}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      getOptionLabel={(option) => option.name || ''}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      disabled={disabled || loading}
      
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required
          error={error || !!queryError}
          helperText={queryError ? 'Failed to load companies' : helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default CompanySelector;