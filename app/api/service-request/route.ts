export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data?.name || !data?.email || !data?.description || !data?.serviceType) {
      return NextResponse.json({ error: "Заполните все обязательные поля" }, { status: 400 });
    }

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        serviceType: data.serviceType,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        description: data.description,
        budget: data.budget || null,
      },
    });

    // Отправка в Telegram
    try {
      const token = '8867302266:AAH5xir23T4azcSPnuegn8T6IZSQvDWlMuI';
      const chatId = '988025379';
      
      const message = `🛠 Новая заявка:\n\n📌 Услуга: ${data.serviceType}\n👤 Имя: ${data.name}\n📧 Email: ${data.email}\n📞 Телефон: ${data.phone || 'Не указан'}\n💰 Бюджет: ${data.budget || 'Не указан'}\n💬 Описание: ${data.description}`;
      
      const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
      
      await fetch(telegramUrl);
    } catch (telegramErr) {
      console.error('Telegram error:', telegramErr);
    }

    return NextResponse.json({ success: true, serviceRequest });
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
