import { ApolloError } from "apollo-server-express";
import { AuthenticationError, ValidationError, NotFoundError, ForbiddenError } from "../errors";

export function formatError(error: any) {
  const { originalError } = error;

  if (originalError instanceof AuthenticationError) {
    return new ApolloError(originalError.message, 'UNAUTHENTICATED');
  }

  if (originalError instanceof ValidationError) {
    return new ApolloError(originalError.message, 'BAD_USER_INPUT', {
      details: originalError.message  ,
    });
  }

  if (originalError instanceof NotFoundError) {
    return new ApolloError(originalError.message, 'NOT_FOUND');
  }

  if (originalError instanceof ForbiddenError) {
    return new ApolloError(originalError.message, 'FORBIDDEN');
  }

  // Unknown or unhandled errors
  console.error('Unexpected GraphQL error:', {
    message: error.message,
    path: error.path,
    stack: error.stack,
    extensions: error.extensions,
  });

  if (process.env.NODE_ENV === 'production') {
    return new ApolloError('Internal server error', 'INTERNAL_SERVER_ERROR');
  }

 return new ApolloError(error.message, error.code || 'INTERNAL_ERROR', {
    path: error.path,
    stacktrace: error.stack?.split('\n'),
    ...error.extensions, // spread extensions directly here
  });
}
