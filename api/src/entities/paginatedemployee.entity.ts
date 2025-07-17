import { Field, Int, ObjectType } from "type-graphql";
import { EmployeeDTO } from "./dtos/employees/employeedto";

@ObjectType()
export class PaginatedEmployees {
  @Field(() => [EmployeeDTO])
  data!: EmployeeDTO[];

  @Field(() => Int)
  totalCount!: number;
}