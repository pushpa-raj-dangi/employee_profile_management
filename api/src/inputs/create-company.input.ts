import { InputType, Field } from "type-graphql";

@InputType()
export class CreateCompanyInput {
  @Field() name!: string;
  @Field() zipCode!: string;
  @Field() address!: string;
  @Field() phoneNumber!: string;
  @Field() email!: string;
  @Field({ nullable: true }) website?: string;
  @Field() establishmentDate!: Date;
  @Field({ nullable: true }) remarks?: string;
  @Field(() => [String]) images!: string[];
}
