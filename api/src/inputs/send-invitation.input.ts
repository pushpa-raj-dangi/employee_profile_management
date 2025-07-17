import { InputType, Field, ObjectType } from 'type-graphql';
import { Role } from '../entities';

@InputType()
export class SendInvitationInput {
  
  @Field()
  email!: string;

  @Field(() => Role) 
  role!: Role;

  @Field({ nullable: true })
  companyId?: string;
}


@ObjectType()
export class InvitationResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;
}
