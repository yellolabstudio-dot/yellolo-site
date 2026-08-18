export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
    }
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } }, user: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const data = await request.json();
    const { items, name, email, phone, address, notes } = data;
    if (!items?.length || !name || !email) {
      return NextResponse.json({ error: "Заполните обязательные поля" }, { status: 400 });
    }

    const productIds = items.map((i: any) => i?.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(products.map((p: any) => [p.id, p]));

    let totalAmount = 0;
    const orderItems = items.map((i: any) => {
      const product = productMap.get(i?.productId);
      const price = (product as any)?.price ?? 0;
      const qty = i?.quantity ?? 1;
      totalAmount += price * qty;
      return { productId: i?.productId, quantity: qty, price };
    });

    const order = await prisma.order.create({
      data: {
        userId: (session?.user as any)?.id || null,
        name, email, phone: phone || null, address: address || null, notes: notes || null,
        totalAmount,
        items: { create: orderItems },
      },
      include: { items: { include: { product: true } } },
    });

    // Send email notification
    try {
      const itemsList = (order.items ?? []).map((oi: any) => 
        `<li>${oi?.product?.name ?? 'Товар'} x${oi?.quantity ?? 1} — $${(oi?.price ?? 0).toFixed(2)}</li>`
      ).join('');

      const appUrl = process.env.NEXTAUTH_URL || '';
      const appName = 'Yellolab Studio';

      await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deployment_token: process.env.ABACUSAI_API_KEY,
          app_id: process.env.WEB_APP_ID,
          notification_id: process.env.NOTIF_ID_ORDER,
          subject: `Новый заказ #${order.id.slice(0, 8)} от ${name}`,
          body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;"><h2 style="color:#FFFD8F;">Новый заказ</h2><p><strong>Имя:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Телефон:</strong> ${phone || 'Не указан'}</p><p><strong>Адрес:</strong> ${address || 'Не указан'}</p><h3>Товары:</h3><ul>${itemsList}</ul><p style="font-size:18px;"><strong>Итого: $${totalAmount.toFixed(2)}</strong></p></div>`,
          is_html: true,
          recipient_email: 'yellolabstudio@gmail.com',
          sender_email: appUrl ? `noreply@${new URL(appUrl).hostname}` : 'noreply@yellolab.studio',
          sender_alias: appName,
        }),
      });
    } catch (emailErr: any) {
      console.error('Email notification error:', emailErr);
    }

    return NextResponse.json(order);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Ошибка создания заказа" }, { status: 500 });
  }
}
