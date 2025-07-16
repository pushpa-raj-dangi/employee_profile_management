
import { ApolloClient, type NormalizedCacheObject } from "@apollo/client";
import { LOGIN_MUTATION, LOGOUT_MUTATION } from "../graphql/mutations/authMutations";
import { ME_QUERY } from "../graphql/queries/authQueries";

export const loginService = async (
  client: ApolloClient<NormalizedCacheObject>,
  email: string,
  password: string
) => {
  const { data } = await client.mutate({ mutation: LOGIN_MUTATION, variables: { email, password } });
  return data;
};

export const logoutService = async (
  client: ApolloClient<NormalizedCacheObject>
) => {
  const { data } = await client.mutate({ mutation: LOGOUT_MUTATION });
  return data.logout;
};

export const meService = async (client: ApolloClient<NormalizedCacheObject>) => {
  const { data } = await client.query({ query: ME_QUERY, fetchPolicy: "no-cache" });
  return data;
};