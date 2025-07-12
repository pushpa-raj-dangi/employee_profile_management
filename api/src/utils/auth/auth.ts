import { compare, hash } from "bcrypt";
import crypto from "crypto";
import { prisma } from "../../prisma";

const SALT_ROUNDS = 10;

export function generateToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string) {
  return compare(password, hash);
}



export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    throw new Error("Invalid password");
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}


export const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex");
};



