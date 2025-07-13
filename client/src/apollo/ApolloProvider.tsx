import React from "react";
import { ApolloProvider as Provider } from "@apollo/client";
import { client } from "./apolloClient";

interface ApolloWrapperProps {
  children: React.ReactNode;
}

const ApolloProvider: React.FC<ApolloWrapperProps> = ({ children }) => {
  return <Provider client={client}>{children}</Provider>;
};

export default ApolloProvider;
