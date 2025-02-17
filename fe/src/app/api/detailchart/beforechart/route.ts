// src/app/api/detailchart/history/route.ts

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // ✅ 한국투자증권 API 요청에 필요한 환경 변수 가져오기
    const appKey = process.env.APP_KEY
    const secretKey = process.env.APP_SECRET_KEY
    const stockCode = '005930' // 삼성전자 (예제)

    if (!appKey || !secretKey) {
      return NextResponse.json({ error: 'API 키가 설정되지 않음' }, { status: 500 })
    }

    // ✅ 현재 날짜를 기준으로 9:00부터 현재 시간까지 1분봉 데이터를 가져옴
    const now = new Date()
    const today = now.toISOString().split('T')[0] // YYYY-MM-DD 형식
    const startTime = `${today} 09:00:00`
    const endTime = now.toISOString().replace('T', ' ').split('.')[0] // 현재 시간까지

    // ✅ 한국투자증권 1분봉 데이터 요청 API 호출
    const response = await fetch(`https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/minutes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'appKey': appKey,
        'appSecret': secretKey,
        'tr_id': 'FHKST01010400', // 한국투자증권의 1분봉 데이터 요청 ID
      },
      body: JSON.stringify({
        fid_input_iscd: stockCode, // 종목 코드 (삼성전자: 005930)
        fid_cond_mrkt_div_code: 'J', // 시장 코드 (코스피: J, 코스닥: Q)
        fid_period_div_code: '1', // 1분봉 데이터 요청
        fid_org_adj_prc: '1', // 수정주가 반영 여부
        fid_input_date_1: startTime, // 시작 시간 (09:00)
        fid_input_date_2: endTime, // 현재 시간
      }),
    })

    const data = await response.json()

    if (!data.output || data.output.length === 0) {
      return NextResponse.json({ error: '과거 데이터 없음', details: data }, { status: 500 })
    }

    // ✅ 한국투자증권 API 응답 데이터 변환
    interface ApiResponse {
        output: ApiResponseEntry[];
    }

    interface ApiResponseEntry {
        stck_bsop_date: string;
        stck_bsop_hour: string;
        stck_bsop_minute: string;
        stck_clpr: string;
    }

    interface Candle {
        timestamp: string;
        price: number;
    }

    const candles: Candle[] = data.output.map((entry: ApiResponseEntry) => ({
        timestamp: entry.stck_bsop_date + ' ' + entry.stck_bsop_hour + ':' + entry.stck_bsop_minute, // "YYYY-MM-DD HH:mm"
        price: parseFloat(entry.stck_clpr), // 종가 (현재가)
    }));

    return NextResponse.json(candles, { status: 200 })
  } catch (error) {
    console.error('❌ 과거 데이터 요청 실패:', error)
    return NextResponse.json({ error: '과거 데이터 요청 실패', details: error }, { status: 500 })
  }
}
