'use client'

import React, { useMemo } from 'react'
import Chart from '@components/Chart'

export type StockData = {
  timestamp: string
  price: number
}

interface DetailChartProps {
  stockData?: StockData[]  // 데이터가 없을 경우 undefined가 될 수 있으므로 optional 처리
}

export default function DetailChart({ stockData = [] }: DetailChartProps) {
  const symbol = '퀀텀 컴퓨팅' // 주식 심볼 (고정값)

  // 데이터가 아직 없으면 로딩 메시지 렌더링
  if (stockData.length === 0) {
    return <div>데이터를 불러오는 중입니다...</div>
  }

  // x축 라벨과 y축 데이터를 메모이제이션하여 최적화
  const labels = useMemo(() => stockData.map((data) => data.timestamp), [stockData])
  const prices = useMemo(() => stockData.map((data) => data.price), [stockData])

  const containerStyle = {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  }

  const headerStyle = {
    textAlign: 'center' as const,
    marginBottom: '20px',
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>{symbol} 주식 차트</h1>
      <Chart labels={labels} data={prices} />
    </div>
  )
}
