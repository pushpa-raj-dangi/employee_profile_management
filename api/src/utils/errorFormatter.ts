import { ApolloError } from "apollo-server-express";
import { CustomError, ValidationError } from "../errors";

export function formatError(error: any) {
  const originalError = error.originalError || error;

  if (originalError instanceof CustomError) {
    const extensions: Record<string, any> = {
      code: originalError.code,
      statusCode: originalError.statusCode
    };

    if (originalError instanceof ValidationError && originalError.field) {
      extensions.field = originalError.field;
    }

    return new ApolloError(originalError.message, originalError.code, extensions);
  }

  if (originalError.name === 'PrismaClientKnownRequestError') {
    return new ApolloError(
      "Database error occurred",
      "DATABASE_ERROR",
      { statusCode: 500, prismaCode: originalError.code }
    );
  }

  console.error("Unexpected GraphQL error:", {
    message: error.message,
    path: error.path,
    stack: error.stack,
    extensions: error.extensions,
    originalError: originalError,
  });

  if (process.env.NODE_ENV === "production") {
    return new ApolloError(
      "Internal server error", 
      "INTERNAL_SERVER_ERROR",
      { statusCode: 500 }
    );
  }

  // 5. Return detailed error in development
  return error;
}