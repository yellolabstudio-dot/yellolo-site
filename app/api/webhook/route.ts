import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const clonedRequest = request.clone();
    const headersList = request.headers;
    const sigHeader = headersList.get('x-nowpayments-sig');

    const rawBody = await request.text();
    const paymentData = JSON.parse(rawBody);

    // Проверка цифровой подписи для безопасности (используем ваш IPN ключ)
    const ipnSecret = process.env.NOWPAYMENTS_IPN_KEY;
    
    if (ipnSecret && sigHeader) {
      // Сортируем ключи объекта для правильной проверки подписи NOWPayments
      const sortedKeys = Object.keys(paymentData).sort();
      const sortedObj: Record<string, any> = {};
      sortedKeys.forEach(key => {
        sortedObj[key] = paymentData[key];
      });

      const hmac = crypto.createHmac('sha512', ipnSecret);
      hmac.update(JSON.stringify(sortedObj));
      const signature = hmac.digest('hex');

      if (signature !== sigHeader) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    // Проверяем статус платежа
    // Статус 'finished' или 'confirmed' означает успешную оплату
    if (paymentData.payment_status === 'finished' || paymentData.payment_status === 'confirmed') {
      const { order_id, customer_email, pay_amount, pay_currency } = paymentData;

      // TODO: Здесь пишется ваша бизнес-логика:
      // 1. Отправка файла или ссылки на скачивание на customer_email (или в Telegram)
      console.log(`Заказ ${order_id} успешно оплачен! Сумма: ${pay_amount} ${pay_currency}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}