import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const apiURL = import.meta.env.VITE_API_URL || "https://employeeapi25.azurewebsites.net";

const httpLink = createHttpLink({
  uri: `${apiURL}/graphql`,
  credentials: "include",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      console.error(`[GraphQL error]:`, err.message);
    }
  }
  if (networkError) {
    console.error(`[Network error]:`, networkError);
  }
});

export const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});
