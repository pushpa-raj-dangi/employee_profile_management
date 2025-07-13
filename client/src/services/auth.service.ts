
import { ApolloClient, type NormalizedCacheObject } from "@apollo/client";
import { LOGIN_MUTATION, LOGOUT_MUTATION, ME_MUTATION } from "../graphql/mutations/authMutations";

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
  return data;
};

export const meService = async (client: ApolloClient<NormalizedCacheObject>) => {
  const { data } = await client.mutate({ mutation: ME_MUTATION });
  return data;
};
