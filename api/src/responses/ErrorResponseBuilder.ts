import { BaseResponse } from "./BaseResponse";

// Error response builder

export class ErrorResponseBuilder {
    private _message: string;
    private _code: string;
    private _details?: any;

    constructor(message: string) {
        this._message = message;
        this._code = "ERROR";
    }

    withCode(code: string): ErrorResponseBuilder {
        this._code = code;
        return this;
    }

    withDetails(details: any): ErrorResponseBuilder {
        this._details = details;
        return this;
    }

    build(): BaseResponse & { details?: any; } {
        return {
            success: false,
            message: this._message,
            code: this._code,
            timestamp: new Date(),
            details: this._details
        };
    }
}
