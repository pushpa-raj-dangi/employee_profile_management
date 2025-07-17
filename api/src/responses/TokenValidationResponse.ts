import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class TokenValidationResponse {
  @Field()
  success: boolean;

  @Field()
  isValid: boolean;

  @Field()
  message: string;

  @Field({ nullable: true })
  code?: number;

  @Field({ nullable: true })
  errorKey?: string;

  constructor(
    success: boolean,
    isValid: boolean,
    message: string,
    code?: number,
    errorKey?: string
  ) {
    this.success = success;
    this.isValid = isValid;
    this.message = message;
    this.code = code;
    this.errorKey = errorKey;
  }
}
