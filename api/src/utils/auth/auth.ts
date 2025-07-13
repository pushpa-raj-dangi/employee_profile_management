import { sign, verify } from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import { prisma } from "../../config/prisma";
import { Role } from "../../entities";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";
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

export function createJWT(user: { id: string; email: string; role: Role }) {
  return sign(user, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyJWT(token: string) {
  return verify(token, JWT_SECRET);
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



