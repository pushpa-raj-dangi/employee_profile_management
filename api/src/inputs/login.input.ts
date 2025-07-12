import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { InputType, Field } from 'type-graphql';

@InputType()
export class LoginInput {
  @Field()
  @Length(5, 255)
  @IsEmail()
  email!: string;

  @Field()
  @Length(8, 100)
  @IsNotEmpty()
  @IsString()
  password!: string;
}