export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Заполните все обязательные поля" }, { status: 400 });
    }
    await prisma.contactMessage.create({ data: { name, email, subject: subject || null, message } });

    try {
      const appUrl = process.env.NEXTAUTH_URL || '';
      await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deployment_token: process.env.ABACUSAI_API_KEY,
          app_id: process.env.WEB_APP_ID,
          notification_id: process.env.NOTIF_ID_CONTACT,
          subject: `Новое сообщение от ${name}`,
          body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;"><h2 style="color:#FFFD8F;">Новое сообщение</h2><p><strong>Имя:</strong> ${name}</p><p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p><p><strong>Тема:</strong> ${subject || 'Не указана'}</p><div style="background:#1a1a1a;padding:15px;border-radius:8px;border-left:4px solid #FFFD8F;margin-top:10px;"><p>${message}</p></div></div>`,
          is_html: true,
          recipient_email: 'yellolabstudio@gmail.com',
          reply_to: email,
          sender_email: appUrl ? `noreply@${new URL(appUrl).hostname}` : 'noreply@yellolab.studio',
          sender_alias: 'Yellolab Studio',
        }),
      });
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Ошибка отправки" }, { status: 500 });
  }
}
