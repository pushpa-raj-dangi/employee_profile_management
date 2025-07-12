import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      user {
        id
        email
        role
      }
    }
  }
`;

export const ME_MUTATION = gql`
  mutation Me {
    me {
      success
      user {
        id
        email
        role
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
    logout
  }
`;