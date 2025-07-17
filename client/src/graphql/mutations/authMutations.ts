import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      data {
        id
      }
    }
  }
`;

export const COMPLETE_REGISTRATION = gql`
  mutation CompleteRegistration(
    $token: String!
    $registerInput: RegisterInput!
    $profileInput: ProfileInput!
  ) {
    completeRegistration(
      token: $token
      registerInput: $registerInput
      profileInput: $profileInput
    ) {
      success
      message
      code
      affectedRows
      insertedId
    }
  }
`;


export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
      message
      code
    }
  }
`;

