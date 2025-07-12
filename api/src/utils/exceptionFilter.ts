import { MiddlewareFn } from "type-graphql";
import { Context } from "../types";
import { AuthenticationError, ValidationError } from "../errors";
import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql/error/GraphQLError";

export const ExceptionFilter: MiddlewareFn<Context> = async (
  { context, info },
  next
) => {
  try {
    return await next();
  } catch (err) {
    const isValidationError = (error: any): error is ValidationError => {
      return (
        error instanceof ValidationError ||
        (error && error.name === "ValidationError")
      );
    };
    if (isValidationError(err)) {
      throw new GraphQLError("Validation failed", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    if (err instanceof AuthenticationError) {
      throw new GraphQLError("Authentication failed", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err["code"] === "P1001") {
        throw new GraphQLError(
          "Database connection error. Please try again later."
        );
      }
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        const field =
          (err.meta?.target as string[] | undefined)?.join(", ") || "field";
        throw new ValidationError(`A user with that ${field} already exists.`);
      }
    }

    if (err instanceof AuthenticationError || err instanceof ValidationError) {
      throw err;
    }

    console.error(`[${info.parentType.name}.${info.fieldName}]`, err);

    throw new Error("An unexpected error occurred");
  }
};
