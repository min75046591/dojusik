'use client'

import React, { useMemo } from 'react'
import Chart from '@components/Chart'

export type StockData = {
  timestamp: string
  price: number
}

interface DetailChartProps {
  stockData?: StockData[]
}

export default function DetailChart({ stockData = [] }: DetailChartProps) {
  const symbol = '삼성 전자'

  if (stockData.length === 0) {
    return <div>데이터를 불러오는 중입니다...</div>
  }

  // x축 라벨과 y축 데이터를 추출
  const labels = useMemo(() => stockData.map((data) => data.timestamp), [stockData])
  const prices = useMemo(() => stockData.map((data) => data.price), [stockData])
  // 최신 주식 가격은 배열의 마지막 항목의 price 값
  const currentPrice = stockData[stockData.length - 1].price

  const containerStyle = {
    padding: '20px',
    maxWidth: '400px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  }

  const headerStyle = {
    textAlign: 'left' as const,
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
  }

  const stockInfoStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
    marginBottom: '20px',
  }

  const stockPriceStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#000',
  }

  const stockChangeStyle = {
    fontSize: '14px',
    color: '#ff3b30',
  }

  const chartContainerStyle = {
    position: 'relative' as const,
    width: '100%',
    height: '200px',
    marginBottom: '20px',
  }

  const periodSelectorStyle = {
    display: 'flex',
    justifyContent: 'space-around' as const,
    marginBottom: '20px',
  }

  const periodButtonStyle = {
    border: 'none',
    background: 'none',
    fontSize: '14px',
    color: 'gray',
    cursor: 'pointer',
  }

  const periodButtonActiveStyle = {
    fontWeight: 'bold',
    color: '#00aaff',
    borderBottom: '2px solid #00aaff',
  }

  const detailsButtonStyle = {
    display: 'flex',
    justifyContent: 'space-around' as const,
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '10px',
    fontSize: '14px',
    marginBottom: '20px',
  }

  const buyButtonStyle = {
    width: '100%',
    backgroundColor: '#00c853',
    color: 'white',
    padding: '15px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textAlign: 'center' as const,
  }

  const buyButtonHoverStyle = {
    backgroundColor: '#00a844',
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>{symbol} 주식 차트</h1>
      <div style={stockInfoStyle}>
        <div style={stockPriceStyle}>현재 주식 가격: {currentPrice}원</div>
        <div style={stockChangeStyle}>+1,89 (+4.59%) Past Month</div>
      </div>

      <div style={chartContainerStyle}>
        <Chart labels={labels} data={prices} />
      </div>

      <div style={periodSelectorStyle}>
        <button style={periodButtonStyle}>1D</button>
        <button style={periodButtonStyle}>1W</button>
        <button style={periodButtonActiveStyle}>1M</button>
        <button style={periodButtonStyle}>1Y</button>
        <button style={periodButtonStyle}>5Y</button>
        <button style={periodButtonStyle}>ALL</button>
      </div>

      <div style={detailsButtonStyle}>
        <span style={{ fontWeight: 'bold', color: '#000' }}>요약</span>
        <span style={{ fontWeight: 'bold', color: '#000' }}>상세 정보</span>
      </div>

      <button
        style={buyButtonStyle}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = buyButtonHoverStyle.backgroundColor)}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = buyButtonStyle.backgroundColor)}
      >
        주식 구매하기
      </button>
    </div>
  )
}
