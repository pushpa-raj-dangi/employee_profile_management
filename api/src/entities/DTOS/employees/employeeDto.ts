import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class EmployeeDTO {
  @Field()
  id!: string;

  @Field()
  email!: string;

  @Field()
  companyName!: string;

  @Field(() => EmployeeProfile, { nullable: true })
  profile?: EmployeeProfile | null;

  @Field({ nullable: true })
  isActive?: boolean;
}

@ObjectType()
export class EmployeeProfile {
  @Field()
  firstName!: string;

  @Field()
  lastName!: string;
}
