import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Avtorizatsiyadan o'tilmagan" }, { status: 401 });
  }

  if ((session.role || "").toUpperCase() !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Kirish taqiqlangan. Faqat Super Admin uchun." }, { status: 403 });
  }

  try {
    const users = await prisma.adminUser.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Users GET error:", error);
    return NextResponse.json({ error: "Foydalanuvchilarni yuklashda xatolik" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Avtorizatsiyadan o'tilmagan" }, { status: 401 });
  }

  if ((session.role || "").toUpperCase() !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Kirish taqiqlangan. Faqat Super Admin uchun." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { username, password, name, role } = body;

    if (!username || typeof username !== "string" || username.trim().length < 3) {
      return NextResponse.json(
        { error: "Login (username) kamida 3 ta belgidan iborat bo'lishi kerak" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Ism / lavozim kamida 2 ta belgidan iborat bo'lishi kerak" },
        { status: 400 }
      );
    }

    const cleanRole = role === "super_admin" ? "super_admin" : "admin";
    const cleanUsername = username.trim().toLowerCase();

    // Check duplicate
    const existing = await prisma.adminUser.findUnique({
      where: { username: cleanUsername },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu logindagi foydalanuvchi allaqachon mavjud" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await prisma.adminUser.create({
      data: {
        username: cleanUsername,
        passwordHash,
        name: name.trim(),
        role: cleanRole,
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Users POST error:", error);
    return NextResponse.json({ error: "Foydalanuvchi yaratishda xatolik" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Avtorizatsiyadan o'tilmagan" }, { status: 401 });
  }

  if ((session.role || "").toUpperCase() !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Kirish taqiqlangan. Faqat Super Admin uchun." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, name, role, password } = body;

    if (!id) {
      return NextResponse.json({ error: "Foydalanuvchi ID ko'rsatilmadi" }, { status: 400 });
    }

    const targetUser = await prisma.adminUser.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 });
    }

    const updateData: {
      name?: string;
      role?: string;
      passwordHash?: string;
    } = {};

    if (name && typeof name === "string" && name.trim().length >= 2) {
      updateData.name = name.trim();
    }

    const cleanRole = role ? role.toUpperCase() : undefined;
    if (cleanRole && (cleanRole === "SUPER_ADMIN" || cleanRole === "ADMIN")) {
      const isTargetSuper = targetUser.role.toUpperCase() === "SUPER_ADMIN";
      if (isTargetSuper && cleanRole !== "SUPER_ADMIN") {
        const allUsers = await prisma.adminUser.findMany();
        const superCount = allUsers.filter((u) => u.role.toUpperCase() === "SUPER_ADMIN").length;
        if (superCount <= 1) {
          return NextResponse.json(
            { error: "Tizimda kamida 1 ta Super Admin qolishi shart" },
            { status: 400 }
          );
        }
      }
      updateData.role = cleanRole;
    }

    if (password) {
      if (typeof password !== "string" || password.length < 6) {
        return NextResponse.json(
          { error: "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak" },
          { status: 400 }
        );
      }
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.adminUser.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("Users PATCH error:", error);
    return NextResponse.json({ error: "Foydalanuvchini yangilashda xatolik" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Avtorizatsiyadan o'tilmagan" }, { status: 401 });
  }

  if ((session.role || "").toUpperCase() !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Kirish taqiqlangan. Faqat Super Admin uchun." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: "Foydalanuvchi ID ko'rsatilmadi" }, { status: 400 });
    }

    if (id === session.userId) {
      return NextResponse.json(
        { error: "O'z hisobingizni o'chira olmaysiz" },
        { status: 400 }
      );
    }

    const targetUser = await prisma.adminUser.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 });
    }

    if ((targetUser.role || "").toUpperCase() === "SUPER_ADMIN") {
      const allUsers = await prisma.adminUser.findMany();
      const superCount = allUsers.filter((u) => u.role.toUpperCase() === "SUPER_ADMIN").length;
      if (superCount <= 1) {
        return NextResponse.json(
          { error: "Tizimda kamida 1 ta Super Admin qolishi shart" },
          { status: 400 }
        );
      }
    }

    await prisma.adminUser.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Foydalanuvchi o'chirildi" });
  } catch (error) {
    console.error("Users DELETE error:", error);
    return NextResponse.json({ error: "Foydalanuvchini o'chirishda xatolik" }, { status: 500 });
  }
}
