import { gql } from "@apollo/client";

export const SEND_INVITE_USER_MUTATION = gql`
  mutation SendInvitation($input: SendInvitationInput!) {
    sendInvitation(input: $input) {
      email
      role
      company {
        id
        name
      }
      __typename
    }
  }
`;
