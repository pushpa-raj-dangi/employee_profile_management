import { gql } from "@apollo/client";

export const VALIDATE_TEMP_PASSWORD = gql`
  mutation ValidateTempPassword($token: String!, $password: String!) {
    validateTempPassword(token: $token, password: $password) {
      success
      isValid
      message
      code
      errorKey
    }
  }
`;
