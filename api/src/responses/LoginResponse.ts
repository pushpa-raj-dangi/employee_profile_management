import { Field, ObjectType } from "type-graphql";
import { BaseResponse } from "./BaseResponse";
import { User } from "../entities";

@ObjectType("LoginResponse")
export class LoginResponse extends BaseResponse {
  @Field(() => User, { nullable: true })
  data?: User;

  constructor(
    success: boolean,
    message?: string,
    code?: string,
    data?: User
  ) {
    super(success, message, code);
    this.data = data;
  }
}