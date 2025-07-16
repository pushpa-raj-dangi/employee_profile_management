import { ObjectType, Field, ClassType } from "type-graphql";
import { BaseResponse } from "./BaseResponse";
import { User } from "./User";


export function createGenericResponse<T extends object>(
  DataType: ClassType<T>,
  responseName: string = "GenericResponse"
): ClassType<BaseResponse & { data?: T }> {
  @ObjectType(responseName)
  class GenericResponse extends BaseResponse {
    @Field(() => DataType, { nullable: true })
    data?: T;

    constructor(
      success: boolean,
      message?: string,
      code?: string,
      data?: T
    ) {
      super(success, message, code);
      this.data = data;
    }
  }

  return GenericResponse;
}


export const UserResponse = createGenericResponse(User, "UserResponse");
export const LoginResponse = createGenericResponse(User, "LoginResponse");

export function createListResponse<T extends object>(
  ItemType: ClassType<T>,
  responseName: string = "ListResponse"
): ClassType<BaseResponse & { data?: T[]; total?: number; page?: number; limit?: number }> {
  @ObjectType(responseName)
  class ListResponse extends BaseResponse {
    @Field(() => [ItemType], { nullable: true })
    data?: T[];

    @Field({ nullable: true })
    total?: number;

    @Field({ nullable: true })
    page?: number;

    @Field({ nullable: true })
    limit?: number;

    constructor(
      success: boolean,
      message?: string,
      code?: string,
      data?: T[],
      pagination?: { total?: number; page?: number; limit?: number }
    ) {
      super(success, message, code);
      this.data = data;
      this.total = pagination?.total;
      this.page = pagination?.page;
      this.limit = pagination?.limit;
    }
  }

  return ListResponse;
}

// Helper function to wrap any data in a response
export function wrapResponse<T>(
  data: T,
  message?: string,
  code?: string
): BaseResponse & { data: T } {
  return {
    success: true,
    message: message || "Operation successful",
    code: code || "SUCCESS",
    timestamp: new Date(),
    data
  };
}

