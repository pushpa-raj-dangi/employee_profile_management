import { createContext } from "react";
import type { SnackbarContextValue } from "../hooks/useSnackbar";

export const SnackbarContext = createContext<SnackbarContextValue | null>(null);
