import { InputType, Field } from 'type-graphql';
import { Role } from '../entities/user.entity';

@InputType()
export class InvitationInput {

  @Field()
  id!: string;
  
  @Field()
  email!: string;

  @Field(() => Role)
  role!: Role;

  @Field()
  companyId!: string;
  @Field()
  status!: string;

  @Field()
  expiresAt!: Date;
}