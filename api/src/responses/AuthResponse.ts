import { createUnionType } from "type-graphql";
import { LoginResponse } from ".";
import { BaseResponse } from "./BaseResponse";


export const AuthResponse = createUnionType({
    name: "AuthResponse",
    types: () => [LoginResponse, BaseResponse] as const,
    resolveType: (value) => {
        if ("data" in value) {
            return LoginResponse;
        }
        return BaseResponse;
    },
});
