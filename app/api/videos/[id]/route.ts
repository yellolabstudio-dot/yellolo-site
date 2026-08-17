export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
    }
    const data = await request.json();
    const video = await prisma.video.update({ where: { id: params?.id }, data });
    return NextResponse.json(video);
  } catch (err: any) {
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
    }
    await prisma.video.update({ where: { id: params?.id }, data: { active: false } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}
