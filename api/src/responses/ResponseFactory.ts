import { BaseResponse } from "./BaseResponse";


export class ResponseFactory {
    static success<T>(data?: T, message?: string): BaseResponse & { data?: T; } {
        return {
            success: true,
            message: message || "Operation successful",
            code: "SUCCESS",
            timestamp: new Date(),
            data
        };
    }

    static error(message: string, code?: string): BaseResponse {
        return {
            success: false,
            message,
            code: code || "ERROR",
            timestamp: new Date()
        };
    }

    static validation(message: string, code?: string): BaseResponse {
        return {
            success: false,
            message,
            code: code || "VALIDATION_ERROR",
            timestamp: new Date()
        };
    }

    static notFound(message: string = "Resource not found"): BaseResponse {
        return {
            success: false,
            message,
            code: "NOT_FOUND",
            timestamp: new Date()
        };
    }

    static unauthorized(message: string = "Unauthorized"): BaseResponse {
        return {
            success: false,
            message,
            code: "UNAUTHORIZED",
            timestamp: new Date()
        };
    }

    static forbidden(message: string = "Forbidden"): BaseResponse {
        return {
            success: false,
            message,
            code: "FORBIDDEN",
            timestamp: new Date()
        };
    }
}
