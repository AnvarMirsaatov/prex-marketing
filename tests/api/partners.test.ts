/**
 * Tests for /api/admin/partners route
 * Tests: GET list, POST create (with/without logo URL), PUT update, DELETE
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST, PUT, DELETE } from "@/app/api/admin/partners/route";
import { prisma } from "@/lib/prisma";

const mockPartner = {
  id: "partner-1",
  name: "Acme Corp",
  logoUrl: "/uploads/acme-logo.png",
  websiteUrl: "https://acme.uz",
  order: 0,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function makeRequest(method: string, body?: object, url = "http://localhost/api/admin/partners") {
  return new Request(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe("GET /api/admin/partners", () => {
  it("returns 200 with partners array", async () => {
    vi.mocked(prisma.partner.findMany).mockResolvedValueOnce([mockPartner]);
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.partners).toHaveLength(1);
    expect(data.partners[0].name).toBe("Acme Corp");
  });

  it("returns 200 with empty array when no partners", async () => {
    vi.mocked(prisma.partner.findMany).mockResolvedValueOnce([]);
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.partners).toHaveLength(0);
  });

  it("returns 500 if database throws", async () => {
    vi.mocked(prisma.partner.findMany).mockRejectedValueOnce(new Error("DB error"));
    const res = await GET();
    expect(res.status).toBe(500);
  });
});

describe("POST /api/admin/partners", () => {
  beforeEach(() => {
    vi.mocked(prisma.partner.create).mockResolvedValue(mockPartner);
  });

  it("creates partner with a URL logo (normal case)", async () => {
    const req = makeRequest("POST", {
      name: "Acme Corp",
      logoUrl: "/uploads/acme-logo.png",
      websiteUrl: "https://acme.uz",
      order: 0,
      isActive: true,
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.partner.name).toBe("Acme Corp");
  });

  it("creates partner without optional websiteUrl", async () => {
    const req = makeRequest("POST", {
      name: "Simple Partner",
      logoUrl: "/uploads/simple.png",
      order: 1,
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it("parses string order to number", async () => {
    const req = makeRequest("POST", {
      name: "Partner",
      logoUrl: "/uploads/logo.png",
      order: "5", // sent as string (common form bug)
    });
    await POST(req);
    expect(prisma.partner.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ order: 5 }),
      })
    );
  });

  it("returns 401 when not authenticated", async () => {
    const { getAdminSession } = await import("@/lib/auth");
    vi.mocked(getAdminSession).mockResolvedValueOnce(null);
    const req = makeRequest("POST", { name: "Test", logoUrl: "/logo.png" });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 403 when role is ADMIN (not SUPER_ADMIN)", async () => {
    const { getAdminSession } = await import("@/lib/auth");
    vi.mocked(getAdminSession).mockResolvedValueOnce({
      userId: "u1",
      username: "admin",
      name: "Admin",
      role: "ADMIN",
    });
    const req = makeRequest("POST", { name: "Test", logoUrl: "/logo.png" });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });
});

describe("PUT /api/admin/partners", () => {
  it("updates partner and returns 200", async () => {
    vi.mocked(prisma.partner.update).mockResolvedValueOnce({
      ...mockPartner,
      name: "Updated Corp",
    });
    const req = makeRequest("PUT", { id: "partner-1", name: "Updated Corp", logoUrl: "/uploads/new.png" });
    const res = await PUT(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("returns 400 when id is missing", async () => {
    const req = makeRequest("PUT", { name: "No ID" });
    const res = await PUT(req);
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/admin/partners", () => {
  it("deletes partner and returns 200", async () => {
    vi.mocked(prisma.partner.findUnique).mockResolvedValueOnce(mockPartner);
    vi.mocked(prisma.partner.delete).mockResolvedValueOnce(mockPartner);
    const req = makeRequest("DELETE", undefined, "http://localhost/api/admin/partners?id=partner-1");
    const res = await DELETE(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("returns 400 when id missing from query", async () => {
    const req = makeRequest("DELETE", undefined, "http://localhost/api/admin/partners");
    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });
});
