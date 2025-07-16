import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query Me {
    me {
      success
      message
      code
      data {
        id
        email
        role
      }
    }
  }
`;