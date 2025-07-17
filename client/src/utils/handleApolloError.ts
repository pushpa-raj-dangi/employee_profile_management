import { ApolloError } from "@apollo/client";
import { useSnackbar } from "../hooks/useSnackbar";

export const useErrorHandler = () => {
  const { showSnackbar } = useSnackbar();

  const handleGraphQLError = (err: unknown, fallbackMessage = "Something went wrong.") => {
    if (err instanceof ApolloError) {
      const message = err.graphQLErrors?.[0]?.message || fallbackMessage;
      showSnackbar(message, "error");
    } else {
      showSnackbar(fallbackMessage, "error");
    }
  };

  return { handleGraphQLError };
};
