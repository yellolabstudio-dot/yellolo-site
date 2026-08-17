export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Укажите email и пароль" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.password) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
    }
    return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Ошибка авторизации" }, { status: 500 });
  }
}
