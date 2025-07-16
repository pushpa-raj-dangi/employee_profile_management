// Base response interface
export interface IBaseResponse {
    success: boolean;
    message?: string;
    code?: string;
    timestamp?: Date;
}
