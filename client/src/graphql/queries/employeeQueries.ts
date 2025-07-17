import { gql } from "@apollo/client";

export const LIST_EMPLOYEES = gql`
  query ListEmployees($searchTerm: String, $skip: Int, $take: Int) {
    listEmployees(searchTerm: $searchTerm, skip: $skip, take: $take) {
      data {
        id
        email
        isActive
        profile {
          firstName
          lastName
        }
        companyName
      }
      totalCount
    }
  }
`;

export const GET_PROFILE_QUERY = gql`
  query GetProfile($userId: String!) {
    getProfile(userId: $userId) {
      id
      firstName
      lastName
      address
      birthday
      phoneNumber
      profileImage
      department
      employeeNumber
      remarks
      postalCode
    }
  }
`;
