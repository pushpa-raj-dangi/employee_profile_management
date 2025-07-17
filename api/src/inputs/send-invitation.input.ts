import { InputType, Field, ObjectType } from 'type-graphql';
import { Role } from '../entities';
import { IsEmail, IsEnum, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class SendInvitationInput {
  @Field()
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  @Field(() => Role)
  @IsEnum(Role, { message: 'Invalid role' })
  role!: Role;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID('4', { message: 'Invalid company ID format' }) // assuming companyId is UUID
  companyId?: string;
}

@ObjectType()
export class InvitationResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;
}
