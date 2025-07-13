import { InputType, Field } from 'type-graphql';
import { Role } from '../entities';

@InputType()
export class SendInvitationInput {
  
  @Field()
  email!: string;

  @Field(() => Role) 
  role!: Role;

  @Field()
  companyId!: string;
}