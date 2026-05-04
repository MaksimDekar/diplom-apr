import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('=== TELEGRAM API WORKING ===');
  
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  
  console.log('Environment check:', {
    hasToken: !!TELEGRAM_BOT_TOKEN,
    hasChatId: !!TELEGRAM_CHAT_ID,
  });

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('❌ Missing Telegram credentials');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    const data = await request.json();
    console.log('Received data:', data);
    
    // Простое сообщение для теста
    const message = `Тест: ${data.name || 'Нет имени'}`;
    
    // Отправляем в Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    const result = await response.json();
    console.log('Telegram response:', result);
    
    return NextResponse.json({ 
      success: result.ok,
      message: result.ok ? 'Message sent' : result.description
    });
    
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Для теста: добавьте GET метод
export async function GET() {
  return NextResponse.json({
    message: 'Telegram API is working!',
    timestamp: new Date().toISOString(),
  });
}
