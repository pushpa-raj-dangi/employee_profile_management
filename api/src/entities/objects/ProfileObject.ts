import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class ProfileObject {
  @Field()
  id!: string;

  @Field()
  address!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field(() => Date)
  birthday!: Date;

  @Field()
  phoneNumber!: string;

  @Field({ nullable: true })
  profileImage?: string;

  @Field()
  department!: string;

  @Field()
  employeeNumber!: string;

  @Field({ nullable: true })
  remarks?: string;

  @Field()
  zipCode!: string;
}