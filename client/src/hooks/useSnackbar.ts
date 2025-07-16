
import { useContext } from "react";
import { SnackbarContext } from "../context/SnackbarContext";

export type SnackbarSeverity = "success" | "error" | "warning" | "info";

export interface SnackbarContextValue {
  showSnackbar: (msg: string, severity?: SnackbarSeverity) => void;
}

export const useSnackbar = (): SnackbarContextValue => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
