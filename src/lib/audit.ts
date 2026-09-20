import { prisma } from "@/lib/prisma";
import type { AdminSession } from "@/lib/auth";

export interface CreateAuditLogParams {
  userId?: string | null;
  userName?: string | null;
  userRole?: string | null;
  action: string;
  entity: string;
  details: string;
}

export async function createAuditLog(params: CreateAuditLogParams) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        userName: params.userName || "Noma'lum admin",
        userRole: params.userRole || "ADMIN",
        action: params.action,
        entity: params.entity,
        details: params.details,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
    return null;
  }
}

export async function logAdminAction(
  session: AdminSession,
  action: string,
  entity: string,
  details: string
) {
  return createAuditLog({
    userId: session.userId,
    userName: session.name || session.username,
    userRole: session.role,
    action,
    entity,
    details,
  });
}
