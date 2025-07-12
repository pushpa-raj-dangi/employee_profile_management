import { Field, ObjectType } from "type-graphql";
import { User } from "../entities/User.entity"; // adjust import if needed

@ObjectType()
export class LoginResponse {
  @Field()
  success!: boolean;

  @Field(() => User)
  user!: User;
}
