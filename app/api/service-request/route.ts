export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data?.name || !data?.email || !data?.description || !data?.serviceType) {
      return NextResponse.json({ error: "Заполните все обязательные поля" }, { status: 400 });
    }
    await prisma.serviceRequest.create({
      data: {
        serviceType: data.serviceType,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        description: data.description,
        budget: data.budget || null,
      },
    });

    try {
      const appUrl = process.env.NEXTAUTH_URL || '';
      await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deployment_token: process.env.ABACUSAI_API_KEY,
          app_id: process.env.WEB_APP_ID,
          notification_id: process.env.NOTIF_ID_ORDER,
          subject: `Заявка на услугу: ${data.serviceType}`,
          body: `<div style="font-family:Arial,sans-serif;"><h2 style="color:#FFFD8F;">Новая заявка на услугу</h2><p><strong>Услуга:</strong> ${data.serviceType}</p><p><strong>Имя:</strong> ${data.name}</p><p><strong>Email:</strong> ${data.email}</p><p><strong>Телефон:</strong> ${data.phone || 'Не указан'}</p><p><strong>Описание:</strong> ${data.description}</p><p><strong>Бюджет:</strong> ${data.budget || 'Не указан'}</p></div>`,
          is_html: true,
          recipient_email: 'yellolabstudio@gmail.com',
          reply_to: data.email,
          sender_email: appUrl ? `noreply@${new URL(appUrl).hostname}` : 'noreply@yellolab.studio',
          sender_alias: 'Yellolab Studio',
        }),
      });
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth-options");
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
    }
    const requests = await prisma.serviceRequest.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(requests);
  } catch (err: any) {
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}
