import { TextField } from "@mui/material";
import type { FieldErrors, Path, UseFormRegister } from "react-hook-form";


interface FormFieldProps<T extends Record<string, unknown>> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  name: Path<T>;
  label: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  helperText?: string;
}

export const FormField = <T extends Record<string, unknown>>({
  register,
  errors,
  name,
  label,
  type = "text",
  required = false,
  multiline = false,
  rows = 1,
  placeholder = "",
  helperText = ""
}: FormFieldProps<T>) => (
  <TextField
    margin="normal"
    required={required}
    fullWidth
    id={name}
    label={label}
    type={type}
    multiline={multiline}
    rows={rows}
    placeholder={placeholder}
    error={!!errors[name]}
    helperText={String(errors[name]?.message || helperText)}
    {...register(name)}
  />
);