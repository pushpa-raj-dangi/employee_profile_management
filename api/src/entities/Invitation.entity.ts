import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import { Role, User } from './User.entity';
import { Company } from './Company.entity';

export enum InvitationStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(InvitationStatus, {
  name: 'InvitationStatus',
  description: 'Status of the invitation',
});

@ObjectType()
export class Invitation {
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

  @Field(() => User)
  invitedBy!: User;

  @Field(() => User, { nullable: true })
  invitedUser?: User;

  @Field(() => Company)
  company!: Company;

  @Field()
  expiresAt!: Date;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}