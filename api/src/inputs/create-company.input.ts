import { IsEmail, Length } from "class-validator";
import { InputType, Field } from "type-graphql";

@InputType()
export class CreateCompanyInput {
  @Length(5, 255) 
  @Field() name!: string;
  @Field() zipCode!: string;
  @Field() address!: string;
  @Field() phoneNumber!: string;
  @IsEmail()
  @Length(5, 255)
  @Field() email!: string;
  @Field({ nullable: true }) website?: string;
  @Field() establishmentDate!: Date;
  @Field({ nullable: true }) remarks?: string;
  @Field(() => [String]) images!: string[];
}
