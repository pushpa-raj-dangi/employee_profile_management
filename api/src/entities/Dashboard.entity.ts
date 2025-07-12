import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
export class DashboardStats {
  @Field(() => Int)
  companies!: number;

  @Field(() => Int)
  employees!: number;

  @Field(() => Int)
  pendingInvitations!: number;

  @Field(() => Int)
  activeUsers!: number;
}