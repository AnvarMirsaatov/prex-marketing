import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const SECRET = process.env.ADMIN_SESSION_SECRET || "prox_marketing_session_secret_2026_xyz";
const COOKIE_NAME = "prox_admin_token";

export interface AdminSession {
  userId: string;
  username: string;
  role: string;
  name: string;
  expiresAt: number;
}

export function signToken(payload: AdminSession): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}

export function verifyToken(token: string): AdminSession | null {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;
    const expected = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
    if (signature !== expected) return null;

    const payload: AdminSession = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    if (payload.expiresAt < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setAdminSession(session: Omit<AdminSession, "expiresAt">) {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const token = signToken({ ...session, expiresAt });

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function verifyAdminCredentials(username: string, passwordPlain: string) {
  const admin = await prisma.adminUser.findUnique({
    where: { username },
  });
  if (!admin) return null;

  const valid = await bcrypt.compare(passwordPlain, admin.passwordHash);
  if (!valid) return null;

  return {
    userId: admin.id,
    username: admin.username,
    role: admin.role,
    name: admin.name,
  };
}
