/**
 * Tests for /api/admin/services route
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST, PUT, DELETE } from "@/app/api/admin/services/route";
import { prisma } from "@/lib/prisma";

const mockService = {
  id: "service-1",
  slug: "smm",
  category: "SMM",
  titleUz: "SMM Xizmatlari",
  titleRu: "SMM Услуги",
  titleEn: null,
  descUz: "Tavsif UZ",
  descRu: "Tavsif RU",
  descEn: null,
  icon: "trending-up",
  order: 0,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function makeRequest(method: string, body?: object, url = "http://localhost/api/admin/services") {
  return new Request(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe("GET /api/admin/services", () => {
  it("returns 200 with services array", async () => {
    vi.mocked(prisma.service.findMany).mockResolvedValueOnce([mockService]);
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.services).toHaveLength(1);
    expect(data.services[0].category).toBe("SMM");
  });
});

describe("POST /api/admin/services", () => {
  beforeEach(() => {
    vi.mocked(prisma.service.create).mockResolvedValue(mockService);
  });

  it("creates service — returns 201", async () => {
    const req = makeRequest("POST", {
      slug: "smm",
      category: "SMM",
      titleUz: "SMM Xizmatlari",
      titleRu: "SMM Услуги",
      descUz: "Tavsif",
      descRu: "Описание",
      order: 0,
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("defaults category to SMM if not provided", async () => {
    const req = makeRequest("POST", {
      slug: "test",
      titleUz: "T", titleRu: "T",
      descUz: "D", descRu: "D",
    });
    await POST(req);
    expect(prisma.service.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ category: "SMM" }),
      })
    );
  });

  it("returns 401 when not authenticated", async () => {
    const { getAdminSession } = await import("@/lib/auth");
    vi.mocked(getAdminSession).mockResolvedValueOnce(null);
    const res = await POST(makeRequest("POST", { slug: "t", titleUz: "T", titleRu: "T" }));
    expect(res.status).toBe(401);
  });
});

describe("PUT /api/admin/services", () => {
  it("updates service — returns 200", async () => {
    vi.mocked(prisma.service.update).mockResolvedValueOnce({ ...mockService, titleUz: "Updated" });
    const req = makeRequest("PUT", { id: "service-1", slug: "smm", category: "SMM",
      titleUz: "Updated", titleRu: "T", descUz: "D", descRu: "D", order: 0 });
    const res = await PUT(req);
    expect(res.status).toBe(200);
  });

  it("returns 400 when id missing", async () => {
    const req = makeRequest("PUT", { titleUz: "No ID" });
    const res = await PUT(req);
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/admin/services", () => {
  it("deletes service — returns 200", async () => {
    vi.mocked(prisma.service.findUnique).mockResolvedValueOnce(mockService);
    vi.mocked(prisma.service.delete).mockResolvedValueOnce(mockService);
    const req = makeRequest("DELETE", undefined, "http://localhost/api/admin/services?id=service-1");
    const res = await DELETE(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });
});
