import { Field, ObjectType } from "type-graphql";
import { User } from "./user.entity";

@ObjectType()
export class LoginResponse {
  @Field()
  success!: boolean;

  @Field(() => User)
  user!: User;
}
