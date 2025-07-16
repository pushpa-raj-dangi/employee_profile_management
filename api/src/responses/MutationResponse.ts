import { ObjectType, Field } from "type-graphql";
import { BaseResponse } from "./BaseResponse";


@ObjectType()
export class MutationResponse extends BaseResponse {
    @Field({ nullable: true })
    affectedRows?: number;

    @Field({ nullable: true })
    insertedId?: string;

    constructor(
        success: boolean,
        message?: string,
        code?: string,
        affectedRows?: number,
        insertedId?: string
    ) {
        super(success, message, code);
        this.affectedRows = affectedRows;
        this.insertedId = insertedId;
    }
}
