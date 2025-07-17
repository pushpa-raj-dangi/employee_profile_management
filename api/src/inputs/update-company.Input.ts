import { InputType, Field } from 'type-graphql';
import { CreateCompanyInput } from './create-company.input';

@InputType()
export class UpdateCompanyInput extends CreateCompanyInput {
  @Field()
  id!: string;
}
