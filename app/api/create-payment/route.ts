import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { priceAmount, orderId, email } = await request.json();

    const response = await fetch('https://api.nowpayments.io/v1/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NOWPAYMENTS_API_KEY!,
      },
      body: JSON.stringify({
        price_amount: priceAmount, // Сумма в USD, например: 15
        price_currency: 'usd',
        pay_currency: 'usdttrc20', // Основная монета по умолчанию
        order_id: orderId,         // Уникальный ID заказа (например, таймстамп или uuid)
        order_description: 'Video Pack Digital Purchase',
        customer_email: email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Payment creation failed' }, { status: 400 });
    }

    // Возвращаем данные платежа (включая invoice_url — ссылку на оплату)
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}