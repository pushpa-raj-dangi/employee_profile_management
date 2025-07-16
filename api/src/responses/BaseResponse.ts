import { ObjectType, Field } from "type-graphql";
import { IBaseResponse } from "./IBaseResponse";

// Generic response class

@ObjectType()
export class BaseResponse implements IBaseResponse {
    @Field()
    success: boolean;

    @Field({ nullable: true })
    message?: string;

    @Field({ nullable: true })
    code?: string;

    @Field({ nullable: true })
    timestamp?: Date;

    constructor(success: boolean, message?: string, code?: string) {
        this.success = success;
        this.message = message;
        this.code = code;
        this.timestamp = new Date();
    }
}
