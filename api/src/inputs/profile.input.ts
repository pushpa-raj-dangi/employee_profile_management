import { Length } from 'class-validator';
import { InputType, Field } from 'type-graphql';

@InputType()
export class ProfileInput {
  @Field({ nullable: true }) 
  id?: string;

  @Field()
  employeeNumber!: string;

  @Field()
  department!: string;

  @Field()
  @Length(3,100)
  firstName!: string;

  @Field()
  @Length(3,100)
  lastName!: string;

  @Field()
  @Length(4,4)
  postalCode!: string;

  @Field()
  address!: string;

  @Field()
  phoneNumber!: string;

  @Field()
  birthday!: Date 

  @Field({ nullable: true })
  remarks?: string;

  @Field({ nullable: true })
  profileImage?: string;

  @Field({ nullable: true })
  userId?: string;
}