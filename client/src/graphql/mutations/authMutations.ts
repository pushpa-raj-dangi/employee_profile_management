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


export const COMPLETE_REGISTRATION_MUTATION = gql`
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
      token
      user {
        id
        email
        role
        profile {
          firstName
          lastName
        }
      }
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

export const IS_TOKEN_VALID = gql`
  mutation IsTokenValid($token: String!) {
    isTokenValid(token: $token)
  }
`;
