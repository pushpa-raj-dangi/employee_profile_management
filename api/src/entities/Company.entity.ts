import { ObjectType, Field, ID } from 'type-graphql';
import { User } from './User.entity';

@ObjectType()
export class Company {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  zipCode!: string;

  @Field()
  address!: string;

  @Field()
  phoneNumber!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  website?: string;

  @Field()
  establishmentDate!: Date;

  @Field({ nullable: true })
  remarks?: string;

  @Field(() => [String])
  images!: string[];

  @Field(() => [User], { nullable: true })
  users!: User[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}



@ObjectType()
export class CompanyResponse {
  @Field()
  id!: string;

  @Field()
  name!: string;

}