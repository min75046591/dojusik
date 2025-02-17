'use client'

import React, { useState, useRef, useEffect } from 'react'
import { StockData } from '@containers/DetailStock/DetailChart'

interface StockWebSocketProps {
  setStockData: React.Dispatch<React.SetStateAction<StockData[]>>
}

export default function StockWebSocket({ setStockData }: StockWebSocketProps) {
  const wsRef = useRef<WebSocket | null>(null)
  const WS_URL = 'ws://ops.koreainvestment.com:31000'

  // ✅ 승인 키를 API에서 요청하는 함수
  const getApprovalKey = async (): Promise<string | null> => {
    try {
      const response = await fetch('/api/detailchart/websocket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()
      return data.approval_key || null
    } catch (error) {
      console.error('❌ 승인 키 요청 실패:', error)
      return null
    }
  }

  // ✅ 과거 데이터를 API에서 가져오는 함수
  const fetchHistoricalData = async (): Promise<StockData[]> => {
    try {
      const response = await fetch('/api/detailchart/beforechart')
      const data = await response.json()

      if (data.length > 0) {
        return data.map((entry: { timestamp: string; price: number }): StockData => ({
          timestamp: entry.timestamp, // "YYYY-MM-DD HH:mm"
          price: entry.price,
        }))
      } else {
        return generateInitialCandles()
      }
    } catch (error) {
      console.error('❌ 과거 데이터 요청 실패:', error)
      return generateInitialCandles()
    }
  }

  // ✅ 9시부터 현재까지 빈 1분봉 생성
  const generateInitialCandles = (): StockData[] => {
    const now = new Date()
    const marketOpen = new Date(now)
    marketOpen.setHours(9, 0, 0, 0)

    const candles: StockData[] = []
    let currentTime = new Date(marketOpen)

    while (currentTime <= now) {
      const timestamp = currentTime.toISOString().slice(0, 16) // "YYYY-MM-DD HH:mm"
      candles.push({ timestamp, price: 0 }) // 기본값 0으로 초기화
      currentTime.setMinutes(currentTime.getMinutes() + 1)
    }

    return candles
  }

  // ✅ 수신한 WebSocket 데이터를 StockData[] 형태로 변환
  const parseStockData = (rawData: string): StockData[] => {
    const parts = rawData.split('|')
    if (parts.length < 4) return []

    const stockInfo = parts[3].split('^')
    const currentTime = new Date().toISOString().slice(0, 16) // "YYYY-MM-DD HH:mm"
    const price = parseFloat(stockInfo[3]) || 0 // 현재가 가져오기

    return [{ timestamp: currentTime, price }]
  }

  // ✅ 실시간 데이터 수신 후 1분봉 업데이트
  const updateStockData = (newStockData: StockData[]) => {
    setStockData(prev => {
      if (prev.length === 0) return generateInitialCandles()

      const lastCandle = prev[prev.length - 1]
      const currentTime = newStockData[0].timestamp

      if (lastCandle.timestamp === currentTime) {
        return prev.map(candle =>
          candle.timestamp === currentTime ? { ...candle, price: newStockData[0].price } : candle
        )
      } else {
        return [...prev, newStockData[0]].slice(-100) // 최신 100개까지만 유지
      }
    })
  }

  // ✅ WebSocket 연결 및 데이터 처리
  const connectWebSocket = (key: string) => {
    if (!key) return
    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => console.log('✅ 웹소켓 연결됨')

    ws.onmessage = event => {
      try {
        const stockData = parseStockData(event.data)
        if (stockData.length > 0) updateStockData(stockData)
      } catch (error) {
        console.log('⚠️ 데이터 변환 실패:', error)
      }
    }

    ws.onerror = event => console.log('⚠️ 웹소켓 오류:', event)
    ws.onclose = () => console.log('❌ 웹소켓 연결 종료됨')
  }

  // ✅ WebSocket 초기화 및 과거 데이터 적용
  useEffect(() => {
    async function initWebSocket() {
      const historicalData = await fetchHistoricalData()
      setStockData(historicalData) // 🔹 9시부터 현재까지의 데이터를 차트에 반영

      const key = await getApprovalKey()
      if (key) connectWebSocket(key)
    }

    initWebSocket()
  }, [])

  return <div />
}
