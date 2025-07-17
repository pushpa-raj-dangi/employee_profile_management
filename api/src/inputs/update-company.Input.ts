import { InputType, Field } from 'type-graphql';

@InputType()
export class UpdateCompanyInput {
  @Field()
  id!: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  postalCode?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  phone?: string;
}
