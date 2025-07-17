import { Length, IsEmail, IsOptional, IsDateString } from 'class-validator';
import { InputType, Field } from 'type-graphql';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @Length(8, 100)
  password!: string;

  @Field()
  tempPassword!: string;
}


