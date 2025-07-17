import { gql } from "@apollo/client";

export const LIST_INVITATIONS = gql`
  query ListInvitations {
    listInvitations {
      id
      email
      token
      role
      status
      invitedBy {
        id
        fullName
      }
    }
  }
`;