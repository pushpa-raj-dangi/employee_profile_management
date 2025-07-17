import { gql } from "@apollo/client";

export const SEND_INVITE_TO_ADMIN_MUTATION = gql`
  mutation SendInvitationToSystemAdmin($input: SendInvitationInput!) {
  sendInvitationToSystemAdmin(input: $input) {
    success
    message
  }
}
`;

export const SEND_INVITATION_MUTATION = gql`
  mutation SendInvitation($input: SendInvitationInput!) {
    sendInvitation(input: $input) {
      success
      message
    }
  }
`;

export const CANCEL_INVITATION = gql`
  mutation CancelInvitation($id: String!) {
    cancelInvitation(id: $id)
  }
`;