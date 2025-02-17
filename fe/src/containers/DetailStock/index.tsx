'use client'

import React, { useState } from 'react'
import DetailChart, { StockData } from '@containers/DetailStock/DetailChart'
import StockWebSocket from '@containers/DetailStock/StockWebSocket'

export default function DetailStock() {
  // 주식 데이터를 배열로 관리 (StockData 타입은 timestamp와 price를 포함)
  const [stockData, setStockData] = useState<StockData[]>([])

  console.log('Stock Data:', stockData)
  return (
    <div>
      {/* DetailChart에는 stockData를 prop으로 전달 */}
      <DetailChart stockData={stockData} />
      {/* StockWebSocket에는 setStockData 함수를 prop으로 전달 */}
      <StockWebSocket setStockData={setStockData} />
    </div>
  )
}
