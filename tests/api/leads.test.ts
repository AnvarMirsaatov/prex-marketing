/**
 * Tests for /api/admin/leads route
 * Tests: GET (with filters), PATCH (status update, note add), DELETE
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, PATCH, DELETE } from "@/app/api/admin/leads/route";
import { prisma } from "@/lib/prisma";

const mockLead = {
  id: "lead-1",
  name: "Abdulloh Karimov",
  phone: "+998901234567",
  serviceType: "SMM",
  comment: "Xizmat kerak",
  status: "yangi",
  source: "website_form",
  assignedToId: null,
  assignedTo: null,
  lastActionById: null,
  lastActionBy: null,
  lastActionAt: null,
  notes: null,
  followUpDate: null,
  followUpNote: null,
  followUpStatus: null,
  followUpSetById: null,
  followUpSetByName: null,
  followUpCompletedAt: null,
  followUpCompletedById: null,
  followUpCompletedByName: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function makeRequest(method: string, body?: object, url = "http://localhost/api/admin/leads") {
  return new Request(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe("GET /api/admin/leads", () => {
  beforeEach(() => {
    vi.mocked(prisma.lead.findMany).mockResolvedValue([mockLead]);
    vi.mocked(prisma.lead.count).mockResolvedValue(1);
  });

  it("returns 200 with leads and counts", async () => {
    const req = makeRequest("GET", undefined, "http://localhost/api/admin/leads");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.leads).toHaveLength(1);
    expect(data.counts).toBeDefined();
    expect(data.currentUser).toBeDefined();
  });

  it("returns 401 when not authenticated", async () => {
    const { getAdminSession } = await import("@/lib/auth");
    vi.mocked(getAdminSession).mockResolvedValueOnce(null);
    const req = makeRequest("GET");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});

describe("PATCH /api/admin/leads — status update", () => {
  beforeEach(() => {
    vi.mocked(prisma.lead.findUnique).mockResolvedValue(mockLead);
    vi.mocked(prisma.lead.update).mockResolvedValue({ ...mockLead, status: "ko'rildi" });
  });

  it("updates lead status — returns 200", async () => {
    const req = makeRequest("PATCH", { id: "lead-1", status: "ko'rildi" });
    const res = await PATCH(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("returns 400 when id missing", async () => {
    const req = makeRequest("PATCH", { status: "ko'rildi" });
    const res = await PATCH(req);
    expect(res.status).toBe(400);
  });

  it("returns 404 when lead not found", async () => {
    vi.mocked(prisma.lead.findUnique).mockResolvedValueOnce(null);
    const req = makeRequest("PATCH", { id: "nonexistent", status: "ko'rildi" });
    const res = await PATCH(req);
    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/admin/leads — note addition", () => {
  it("adds a note to lead notes JSON", async () => {
    vi.mocked(prisma.lead.findUnique).mockResolvedValueOnce({ ...mockLead, notes: null });
    vi.mocked(prisma.lead.update).mockResolvedValueOnce({ ...mockLead });
    const req = makeRequest("PATCH", { id: "lead-1", note: "Mijoz bilan gaplashildi" });
    const res = await PATCH(req);
    expect(res.status).toBe(200);
    // Verify update was called with notes data
    expect(prisma.lead.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          notes: expect.stringContaining("Mijoz bilan gaplashildi"),
        }),
      })
    );
  });

  it("gracefully handles corrupted existing notes JSON", async () => {
    vi.mocked(prisma.lead.findUnique).mockResolvedValueOnce({
      ...mockLead,
      notes: "CORRUPTED_JSON{{{",
    });
    vi.mocked(prisma.lead.update).mockResolvedValueOnce({ ...mockLead });
    const req = makeRequest("PATCH", { id: "lead-1", note: "Yangi izoh" });
    const res = await PATCH(req);
    // Should not throw 500 — should gracefully reset notes
    expect(res.status).toBe(200);
  });
});

describe("DELETE /api/admin/leads", () => {
  it("deletes lead — returns 200", async () => {
    vi.mocked(prisma.lead.findUnique).mockResolvedValueOnce(mockLead);
    vi.mocked(prisma.lead.delete).mockResolvedValueOnce(mockLead);
    const req = makeRequest("DELETE", undefined, "http://localhost/api/admin/leads?id=lead-1");
    const res = await DELETE(req);
    expect(res.status).toBe(200);
  });

  it("returns 400 when id missing", async () => {
    const req = makeRequest("DELETE", undefined, "http://localhost/api/admin/leads");
    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });

  it("returns 403 for non-SUPER_ADMIN", async () => {
    const { getAdminSession } = await import("@/lib/auth");
    vi.mocked(getAdminSession).mockResolvedValueOnce({
      userId: "u1", username: "a", name: "A", role: "ADMIN",
    });
    const req = makeRequest("DELETE", undefined, "http://localhost/api/admin/leads?id=lead-1");
    const res = await DELETE(req);
    expect(res.status).toBe(403);
  });
});
