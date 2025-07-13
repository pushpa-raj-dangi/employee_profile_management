import { User as PrismaUser, Profile as PrismaProfile } from "@prisma/client";
import { Role as GraphQLRole, User as GraphQLUser } from "../entities/user.entity";
import { Profile as GraphQLProfile } from "../entities/profile.entity";

export type PrismaUserWithProfile = PrismaUser & {
  profile?: PrismaProfile | null;
};

function mapPrismaProfileToGraphQLProfile(profile: PrismaProfile): GraphQLProfile {
  return {
    id: profile.id,
    employeeNumber: profile.employeeNumber,
    department: profile.department,
    firstName: profile.firstName,
    lastName: profile.lastName,
    zipCode: profile.zipCode,
    address: profile.address,
    phoneNumber: profile.phoneNumber,
    birthday: profile.birthday,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
    user: undefined,
    remarks: profile.remarks ?? undefined,
    profileImage: profile.profileImage ?? undefined,
  };
}

export function mapPrismaUserToGraphQLUser(user: PrismaUserWithProfile): GraphQLUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role as GraphQLRole,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    password: "",
    isActive: user.isActive ?? true,
    profile: user.profile ? mapPrismaProfileToGraphQLProfile(user.profile) : undefined,
    companies: [],
    invitationsReceived: [],
    invitationsSent: [],
  };
}
