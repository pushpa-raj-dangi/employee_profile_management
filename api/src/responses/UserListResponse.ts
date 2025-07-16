import { createListResponse } from ".";
import { User } from "./User";


export const UserListResponse = createListResponse(User, "UserListResponse");
