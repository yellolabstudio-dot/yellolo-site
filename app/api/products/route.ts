export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const where: any = { active: true };
    if (category) where.category = category;
    const products = await prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
    return NextResponse.json(products);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Ошибка загрузки товаров" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
    }
    const data = await request.json();
    const product = await prisma.product.create({ data });
    return NextResponse.json(product);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Ошибка создания товара" }, { status: 500 });
  }
}
