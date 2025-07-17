import { ApolloError } from "apollo-server-express";
import { CustomError, ValidationError } from "../errors";

export function formatError(error: any) {
  const originalError = error.originalError || error;

  // 1. Handle custom errors
  if (originalError instanceof CustomError) {
    const extensions: Record<string, any> = {
      code: originalError.code,
      statusCode: originalError.statusCode
    };

    // Add field information for validation errors
    if (originalError instanceof ValidationError && originalError.field) {
      extensions.field = originalError.field;
    }

    return new ApolloError(originalError.message, originalError.code, extensions);
  }

  // 2. Handle Prisma errors (if you use Prisma)
  if (originalError.name === 'PrismaClientKnownRequestError') {
    return new ApolloError(
      "Database error occurred",
      "DATABASE_ERROR",
      { statusCode: 500, prismaCode: originalError.code }
    );
  }

  // 3. Log unexpected errors for debugging
  console.error("Unexpected GraphQL error:", {
    message: error.message,
    path: error.path,
    stack: error.stack,
    extensions: error.extensions,
    originalError: originalError,
  });

  // 4. Return sanitized error in production
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