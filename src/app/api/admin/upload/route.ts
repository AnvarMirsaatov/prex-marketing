import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  }

  const role = (session.role || "").toUpperCase();
  if (role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Faqat Super Admin fayl yuklay oladi" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Fayl tanlanmadi" }, { status: 400 });
    }

    const mimeType = file.type;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
    if (!allowedTypes.includes(mimeType)) {
      return NextResponse.json(
        { error: "Faqat rasm fayllari (JPG, PNG, WebP, SVG, GIF) yuklanishi mumkin" },
        { status: 400 }
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Fayl hajmi 10 MB dan oshmasligi kerak" },
        { status: 400 }
      );
    }

    let extension = "jpg";
    if (mimeType === "image/png") extension = "png";
    else if (mimeType === "image/webp") extension = "webp";
    else if (mimeType === "image/svg+xml") extension = "svg";
    else if (mimeType === "image/gif") extension = "gif";

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `hero-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Faylni yuklashda xatolik yuz berdi" }, { status: 500 });
  }
}
