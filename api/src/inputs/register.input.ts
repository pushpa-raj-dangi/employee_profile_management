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

@InputType()
export class ProfileInput {
  @Field()
  @Length(3, 20)
  employeeNumber!: string;

  @Field({ nullable: true })
  @IsOptional()
  department?: string;

  @Field()
  @Length(2, 100)
  fullName!: string;

  @Field({ nullable: true })
  @IsOptional()
  postalCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  phoneNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  birthday?: string;

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;
}
