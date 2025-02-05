// app/services/websocket/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const response = await fetch('https://openapi.koreainvestment.com:9443/oauth2/Approval', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        appkey: process.env.APP_KEY,
        secretkey: process.env.APP_SECRET,
      }),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('API 요청 실패:', error);
    return NextResponse.json({ error: 'API 요청 실패' }, { status: 500 });
  }
}
