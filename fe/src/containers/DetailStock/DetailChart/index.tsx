'use client'

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import Chart from '@components/Chart'
import throttle from 'lodash/throttle'

type StockData = {
  timestamp: string
  price: number
}

export default function DetailChart() {
  const [stockData, setStockData] = useState<StockData[]>([]) // 주식 데이터를 저장하는 상태
  const symbol = '퀀텀 컴퓨팅' // 주식 심볼 (고정값)
  const stockDataRef = useRef(stockData) // 최신 stockData 상태를 안전하게 참조

  // 초기 데이터를 불러오는 함수
  useEffect(() => {
    const fetchInitialData = async () => {
      const response = await fetch('/data/stockData.json') // JSON 파일 경로
      const data: StockData[] = await response.json() // 데이터를 파싱
      setStockData(data) // 상태에 데이터 저장
      stockDataRef.current = data // 참조 상태 업데이트
    }
    fetchInitialData()
  }, [])

  // 실시간 더미 데이터를 생성하는 함수
  const generateDummyData = useCallback(
    throttle(() => {
      const lastTimestamp = stockDataRef.current[stockDataRef.current.length - 1]?.timestamp || new Date().toISOString()
      const newTimestamp = new Date(new Date(lastTimestamp).getTime() + 60000).toISOString() // 1분 후 시간 계산
      const newPrice = stockDataRef.current[stockDataRef.current.length - 1]?.price + (Math.random() * 4 - 2) // -2~+2의 랜덤 값 추가
      const newStock = { timestamp: newTimestamp, price: parseFloat(newPrice.toFixed(2)) }

      setStockData((prev) => {
        const updatedData = [...prev, newStock]
        stockDataRef.current = updatedData // 최신 상태 참조 업데이트
        return updatedData
      })
    }, 1000), // 1초당 1회로 제한
    []
  )

  useEffect(() => {
    const interval = setInterval(() => {
      generateDummyData() // 더미 데이터 생성 호출
    }, 1000)

    return () => clearInterval(interval) // 컴포넌트가 언마운트될 때 interval 제거
  }, [generateDummyData])

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
