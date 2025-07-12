import { ObjectType, Field, ID } from 'type-graphql';
import { User } from './User.entity';

@ObjectType()
export class Profile {
  @Field(() => ID)
  id!: string;

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

  @Field(() => User)
  user!: User;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}