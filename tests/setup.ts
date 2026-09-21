// Global test setup — mock heavy dependencies so unit tests run in isolation
import { vi } from "vitest";

// Mock Prisma client — tests never touch the real DB
vi.mock("@/lib/prisma", () => ({
  prisma: {
    partner: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
    },
    heroSlide: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
    },
    tariff: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
    },
    service: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
    },
    lead: {
      findMany: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    adminUser: {
      findUnique: vi.fn(),
    },
  },
}));

// Mock auth — by default return a SUPER_ADMIN session
vi.mock("@/lib/auth", () => ({
  getAdminSession: vi.fn(async () => ({
    userId: "test-user-id",
    username: "superadmin",
    name: "Test Admin",
    role: "SUPER_ADMIN",
  })),
}));

// Mock audit log — fire-and-forget, don't block tests
vi.mock("@/lib/audit", () => ({
  logAdminAction: vi.fn(async () => null),
  createAuditLog: vi.fn(async () => null),
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock next/server NextResponse — provide minimal implementation
// (actual Next.js NextResponse is not available in plain Node environment)
vi.mock("next/server", async () => {
  const actual = await vi.importActual<typeof import("next/server")>("next/server");
  return actual;
});
