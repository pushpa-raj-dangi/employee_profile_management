import { InputType, Field } from 'type-graphql';

@InputType()
export class ProfileInput {
  @Field()
  employeeNumber!: string;

  @Field()
  department!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  zipCode!: string;

  @Field()
  address!: string;

  @Field()
  phoneNumber!: string;

  @Field()
  birthday!: Date;

  @Field({ nullable: true })
  remarks?: string;

  @Field({ nullable: true })
  profileImage?: string;
}