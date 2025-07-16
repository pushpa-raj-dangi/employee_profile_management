import { ObjectType, Field } from "type-graphql";
import { BaseResponse } from "./BaseResponse";


@ObjectType()
export class TokenValidationResponse extends BaseResponse {
    @Field()
    isValid: boolean;

    @Field({ nullable: true })
    errorType?: string;

    constructor(
        success: boolean,
        isValid: boolean,
        message?: string,
        code?: string,
        errorType?: string
    ) {
        super(success, message, code);
        this.isValid = isValid;
        this.errorType = errorType;
    }
}
