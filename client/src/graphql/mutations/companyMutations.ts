import { gql } from "@apollo/client";

export const CREATE_COMPANY_MUTATION = gql`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      id
      name
      email
    }
  }
`;