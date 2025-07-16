import { RESPONSE_CODES } from "./RESPONSE_CODES";


export type ResponseCode = (typeof RESPONSE_CODES)[keyof typeof RESPONSE_CODES];
