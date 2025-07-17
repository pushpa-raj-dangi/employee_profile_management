import { Field, Int, ObjectType } from "type-graphql";
import { EmployeeDTO } from "./dtos/employees/employeeDto";

@ObjectType()
export class PaginatedEmployees {
  @Field(() => [EmployeeDTO])
  data!: EmployeeDTO[];

  @Field(() => Int)
  totalCount!: number;
}