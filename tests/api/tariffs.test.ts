/**
 * Tests for /api/admin/tariffs route
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST, PUT, DELETE } from "@/app/api/admin/tariffs/route";
import { prisma } from "@/lib/prisma";

const mockTariff = {
  id: "tariff-1",
  nameUz: "Boshlang'ich",
  nameRu: "Начальный",
  nameEn: null,
  serviceType: "SMM",
  price: "$500",
  periodUz: "/ oy",
  periodRu: "/ месяц",
  durationMonths: 1,
  featuresUz: JSON.stringify(["Xizmat 1", "Xizmat 2"]),
  featuresRu: JSON.stringify(["Услуга 1", "Услуга 2"]),
  isPopular: false,
  order: 0,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function makeRequest(method: string, body?: object, url = "http://localhost/api/admin/tariffs") {
  return new Request(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe("GET /api/admin/tariffs", () => {
  it("returns 200 with tariffs array", async () => {
    vi.mocked(prisma.tariff.findMany).mockResolvedValueOnce([mockTariff]);
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.tariffs).toHaveLength(1);
    expect(data.tariffs[0].price).toBe("$500");
  });
});

describe("POST /api/admin/tariffs", () => {
  beforeEach(() => {
    vi.mocked(prisma.tariff.create).mockResolvedValue(mockTariff);
  });

  it("creates tariff — returns 201", async () => {
    const req = makeRequest("POST", {
      nameUz: "Boshlang'ich",
      nameRu: "Начальный",
      serviceType: "SMM",
      price: "$500",
      periodUz: "/ oy",
      periodRu: "/ месяц",
      featuresUz: ["Xizmat 1"],
      featuresRu: ["Услуга 1"],
      order: 0,
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("serializes array featuresUz/featuresRu to JSON string", async () => {
    const req = makeRequest("POST", {
      nameUz: "T",
      nameRu: "T",
      serviceType: "SMM",
      price: "$100",
      periodUz: "/ oy",
      periodRu: "/ м",
      featuresUz: ["Feature 1", "Feature 2"],
      featuresRu: ["Фича 1"],
    });
    await POST(req);
    expect(prisma.tariff.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          featuresUz: '["Feature 1","Feature 2"]',
          featuresRu: '["Фича 1"]',
        }),
      })
    );
  });

  it("parses string order to number", async () => {
    const req = makeRequest("POST", {
      nameUz: "T", nameRu: "T", serviceType: "SMM",
      price: "$100", periodUz: "/ oy", periodRu: "/ м",
      featuresUz: [], featuresRu: [],
      order: "3",
    });
    await POST(req);
    expect(prisma.tariff.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ order: 3 }),
      })
    );
  });

  it("returns 401 when not authenticated", async () => {
    const { getAdminSession } = await import("@/lib/auth");
    vi.mocked(getAdminSession).mockResolvedValueOnce(null);
    const res = await POST(makeRequest("POST", { nameUz: "T", nameRu: "T" }));
    expect(res.status).toBe(401);
  });
});

describe("PUT /api/admin/tariffs", () => {
  it("updates tariff — returns 200", async () => {
    vi.mocked(prisma.tariff.update).mockResolvedValueOnce({ ...mockTariff, price: "$600" });
    const req = makeRequest("PUT", { id: "tariff-1", price: "$600", nameUz: "T", nameRu: "T",
      serviceType: "SMM", periodUz: "/ oy", periodRu: "/ м", featuresUz: [], featuresRu: [] });
    const res = await PUT(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("returns 400 when id missing", async () => {
    const req = makeRequest("PUT", { nameUz: "No ID" });
    const res = await PUT(req);
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/admin/tariffs", () => {
  it("deletes tariff — returns 200", async () => {
    vi.mocked(prisma.tariff.findUnique).mockResolvedValueOnce(mockTariff);
    vi.mocked(prisma.tariff.delete).mockResolvedValueOnce(mockTariff);
    const req = makeRequest("DELETE", undefined, "http://localhost/api/admin/tariffs?id=tariff-1");
    const res = await DELETE(req);
    expect(res.status).toBe(200);
  });

  it("returns 400 when id missing", async () => {
    const req = makeRequest("DELETE", undefined, "http://localhost/api/admin/tariffs");
    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });
});
