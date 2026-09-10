import { PrismaClient } from "@prisma/client";
import path from "node:path";
import fs from "node:fs";

function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL?.trim();
  if (envUrl && envUrl.length > 0) {
    return envUrl;
  }

  const cwdDb = path.join(process.cwd(), "prisma", "dev.db");
  if (fs.existsSync(cwdDb)) {
    return `file:${cwdDb}`;
  }

  return "file:./dev.db";
}

const dbUrl = resolveDatabaseUrl();
process.env.DATABASE_URL = dbUrl;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: dbUrl,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

