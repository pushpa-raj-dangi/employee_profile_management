import { ObjectType, Field } from "type-graphql";


@ObjectType()
export class User {
    @Field()
    id!: string;

    @Field()
    email!: string;

    @Field()
    role!: string;

    @Field({ nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    lastName?: string;
}
