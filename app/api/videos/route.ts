export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  try {
    const videos = await prisma.video.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
    return NextResponse.json(videos);
  } catch (err: any) {
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
    }
    const data = await request.json();
    const video = await prisma.video.create({ data });
    return NextResponse.json(video);
  } catch (err: any) {
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}
