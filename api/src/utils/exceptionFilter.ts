import { MiddlewareFn } from "type-graphql";

export const ExceptionFilter: MiddlewareFn<any> = async ({ context, info }, next) => {
  try {
    return await next();
  } catch (err) {
    throw err;
  }
};
