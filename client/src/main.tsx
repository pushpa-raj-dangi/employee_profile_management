import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ApolloProvider from "./apollo/ApolloProvider.tsx";
import { AuthProvider } from "./auth/AuthProvider.tsx";
import { SnackbarProvider } from "./snackbar/SnackbarProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider>
      <AuthProvider>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>
);
