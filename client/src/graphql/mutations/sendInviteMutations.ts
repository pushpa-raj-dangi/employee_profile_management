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


export const SEND_INVITE_TO_ADMIN_MUTATION = gql`
  mutation SendInvitationToSystemAdmin($input: SendInvitationInput!) {
  sendInvitationToSystemAdmin(input: $input) {
    success
    message
  }
}
`;