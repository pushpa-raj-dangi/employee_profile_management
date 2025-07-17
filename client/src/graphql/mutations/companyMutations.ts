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


export const UPDATE_COMPANY_MUTATION = gql`
  mutation UpdateCompany($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      id
      name
    }
  }
`;