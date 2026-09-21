/**
 * Tests for /api/admin/hero route
 * Tests: GET, POST (field validation, order parsing), PUT (reorder + update), DELETE
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST, PUT, DELETE } from "@/app/api/admin/hero/route";
import { prisma } from "@/lib/prisma";

const mockSlide = {
  id: "slide-1",
  titleUz: "Strategik SMM",
  titleRu: "Стратегический SMM",
  descUz: "Tavsif UZ",
  descRu: "Tavsif RU",
  badgeUz: "SMM",
  badgeRu: "SMM",
  imageUrl: "/uploads/slide1.png",
  buttonTextUz: "Ariza qoldirish",
  buttonTextRu: "Оставить заявку",
  serviceTarget: "SMM",
  order: 0,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function makeRequest(method: string, body?: object, url = "http://localhost/api/admin/hero") {
  return new Request(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe("GET /api/admin/hero", () => {
  it("returns 200 with slides array", async () => {
    vi.mocked(prisma.heroSlide.findMany).mockResolvedValueOnce([mockSlide]);
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.slides).toHaveLength(1);
    expect(data.slides[0].titleUz).toBe("Strategik SMM");
  });

  it("returns 200 with empty array when no slides", async () => {
    vi.mocked(prisma.heroSlide.findMany).mockResolvedValueOnce([]);
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.slides).toHaveLength(0);
  });
});

describe("POST /api/admin/hero", () => {
  beforeEach(() => {
    vi.mocked(prisma.heroSlide.create).mockResolvedValue(mockSlide);
  });

  it("creates slide with all required fields — returns 201", async () => {
    const req = makeRequest("POST", {
      titleUz: "Strategik SMM",
      titleRu: "Стратегический SMM",
      descUz: "Tavsif UZ",
      descRu: "Tavsif RU",
      order: 0,
      isActive: true,
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("parses string order to number (prevents Prisma Int type error)", async () => {
    const req = makeRequest("POST", {
      titleUz: "Slayd",
      titleRu: "Слайд",
      descUz: "Tavsif",
      descRu: "Описание",
      order: "2", // sent as string — common frontend bug
      isActive: "true",
    });
    await POST(req);
    expect(prisma.heroSlide.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ order: 2 }),
      })
    );
  });

  it("returns 400 when required fields are missing", async () => {
    const req = makeRequest("POST", {
      titleUz: "Only UZ title",
      // missing titleRu, descUz, descRu
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when all required fields missing", async () => {
    const req = makeRequest("POST", {});
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 401 when unauthenticated", async () => {
    const { getAdminSession } = await import("@/lib/auth");
    vi.mocked(getAdminSession).mockResolvedValueOnce(null);
    const req = makeRequest("POST", {
      titleUz: "T", titleRu: "T", descUz: "D", descRu: "D",
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("accepts optional imageUrl as a URL path (not base64)", async () => {
    const req = makeRequest("POST", {
      titleUz: "SMM",
      titleRu: "СММ",
      descUz: "Tavsif",
      descRu: "Описание",
      imageUrl: "/uploads/hero-123.png",
      order: 1,
    });
    await POST(req);
    expect(prisma.heroSlide.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ imageUrl: "/uploads/hero-123.png" }),
      })
    );
  });
});

describe("PUT /api/admin/hero — single slide update", () => {
  it("updates slide and returns 200", async () => {
    vi.mocked(prisma.heroSlide.update).mockResolvedValueOnce(mockSlide);
    const req = makeRequest("PUT", {
      id: "slide-1",
      titleUz: "Updated",
      order: 1,
    });
    const res = await PUT(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("returns 400 when id missing", async () => {
    const req = makeRequest("PUT", { titleUz: "No ID" });
    const res = await PUT(req);
    expect(res.status).toBe(400);
  });
});

describe("PUT /api/admin/hero — batch reorder", () => {
  it("reorders slides and returns 200", async () => {
    vi.mocked(prisma.heroSlide.update).mockResolvedValue(mockSlide);
    const req = makeRequest("PUT", {
      reorder: [
        { id: "slide-1", order: 0 },
        { id: "slide-2", order: 1 },
      ],
    });
    const res = await PUT(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    // Should call update twice (once per slide)
    expect(prisma.heroSlide.update).toHaveBeenCalledTimes(2);
  });
});

describe("DELETE /api/admin/hero", () => {
  it("deletes slide by query param and returns 200", async () => {
    vi.mocked(prisma.heroSlide.findUnique).mockResolvedValueOnce(mockSlide);
    vi.mocked(prisma.heroSlide.delete).mockResolvedValueOnce(mockSlide);
    const req = makeRequest("DELETE", undefined, "http://localhost/api/admin/hero?id=slide-1");
    const res = await DELETE(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("returns 400 when id is missing", async () => {
    const req = makeRequest("DELETE", undefined, "http://localhost/api/admin/hero");
    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });
});
