import { gql } from '@apollo/client';

export const GET_COMPANIES_MINIMAL = gql`
  query GetCompaniesMinimal {
    companies {
      id
      name
    }
  }
`;


export const GET_COMPANIES_FULL = gql`
  query GetCompaniesFull {
    companies {
      id
      name
      postalCode
      address
      phoneNumber
      email
      website
      establishmentDate
      remarks
      images
     
      createdAt
      updatedAt
    }
  }
`;


export const GET_COMPANY_BY_ID = gql`
  query GetCompanyById($id: ID!) {
    company(id: $id) {
      id
      name
      postalCode
      address
      phoneNumber
      email
      website
      establishmentDate
      remarks
    }
  }
`;
  