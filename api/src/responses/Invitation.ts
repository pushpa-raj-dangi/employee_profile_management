import { ObjectType, Field, ID } from "type-graphql";
import { Role } from "../entities/user.entity";
import { InvitationStatus } from "../entities/invitation.entity";

@ObjectType()
export class InvitedBy {
  @Field(() => ID)
  id!: string;

  @Field()
  fullName!: string;

  @Field(() => Role)
  role!: Role;

  @Field({ nullable: true })
  email?: string; 
}

@ObjectType()
export class InvitationItemResponse {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  token!: string;

  @Field(() => Role)
  role!: Role;

  @Field(() => InvitationStatus)
  status!: InvitationStatus;

  @Field(() => InvitedBy, { nullable: true })
  invitedBy?: InvitedBy;
}
