import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import { Invitation } from './invitation.entity';
import { Profile } from './profile.entity';
import { Company } from './company.entity';
export enum Role {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  MANAGER = 'MANAGER',
  GENERAL_EMPLOYEE = 'GENERAL_EMPLOYEE',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role privileges',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;
  
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field(() => Role)
  role!: Role;

  @Field(() => [Company], { nullable: true })
  companies?: Company[];

  @Field(() => Profile, { nullable: true })
  profile?: Profile;

  @Field(() => [Invitation], { nullable: true })
  invitationsSent?: Invitation[];

  @Field(() => [Invitation], { nullable: true })
  invitationsReceived?: Invitation[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field()
  isActive: boolean = true;
}


