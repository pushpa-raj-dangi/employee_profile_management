import { Field, ObjectType } from "type-graphql";
import { Profile } from "./profile.entity";


@ObjectType()
export class Employee{
  @Field()
  id!: string;

  @Field()
  email!: string;

  @Field(() => Profile, { nullable: true })
  profile?: Profile;

  @Field()
  companyName!: string;

  @Field()
  isActive: boolean = true;
}


