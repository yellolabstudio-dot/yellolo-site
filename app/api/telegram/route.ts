import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    const text = `📬 Новое сообщение с сайта:\n\n👤 Имя: ${name}\n📧 Email: ${email}\n📌 Тема: ${subject || 'Без темы'}\n💬 Сообщение: ${message}`;

    const TELEGRAM_BOT_TOKEN = '8867302266:AAH5xir23T4azcSPnuegn8T6IZSQvDWlMuI';
    const TELEGRAM_CHAT_ID = '988025379';

    const telegramRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
      }),
    });

    const data = await telegramRes.json();

    if (telegramRes.ok) {
      return NextResponse.json({ success: true });
    }

    console.error('Telegram API Error:', data);
    return NextResponse.json({ success: false, error: data }, { status: 500 });
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}