'use client'

import React, { useState, useRef, useEffect } from 'react'
import CryptoJS from 'crypto-js'
import { StockData } from '@containers/DetailStock/DetailChart'

interface StockWebSocketProps {
  setStockData: React.Dispatch<React.SetStateAction<StockData[]>>
}

export default function StockWebSocket({ setStockData }: StockWebSocketProps) {
  // 내부 상태 및 ref
  const [approvalKey, setApprovalKey] = useState<string>('')
  const [command, setCommand] = useState<string>('1')
  const [logs, setLogs] = useState<string[]>([])
  const [aesKey, setAesKey] = useState<string>('')
  const [aesIv, setAesIv] = useState<string>('')
  const wsRef = useRef<WebSocket | null>(null)

  // 기타 상수 (여기서는 내부 API를 통해 승인키를 요청)
  const STOCK_CODE = '005930' // 예시: 삼성전자
  const HTS_ID = 'YOUR_HTSID'  // 체결통보용 HTS ID
  const CUSTTYPE = 'P'
  const INTERNAL_APPROVAL_URL = '/api/detailchart/websocket'
  const WS_URL = 'ws://ops.koreainvestment.com:31000'

  const logMessage = (msg: string) => {
    setLogs(prev => [...prev, msg])
    console.log(msg)
  }

  const aesCbcBase64Dec = (key: string, iv: string, cipherText: string): string => {
    const keyHex = CryptoJS.enc.Utf8.parse(key)
    const ivHex = CryptoJS.enc.Utf8.parse(iv)
    const decrypted = CryptoJS.AES.decrypt(cipherText, keyHex, {
      iv: ivHex,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
  }

  const getApprovalKey = async (): Promise<string | null> => {
    try {
      const response = await fetch(INTERNAL_APPROVAL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.approval_key) {
        setApprovalKey(data.approval_key)
        logMessage(`approval_key: ${data.approval_key}`)
        return data.approval_key
      } else {
        logMessage('승인키 응답 오류: ' + JSON.stringify(data))
        return null
      }
    } catch (error) {
      logMessage('승인키 요청 실패: ' + error)
      return null
    }
  }

  // 아래 함수들은 기존과 동일 (processStockHoka, processStockSpurchase, processStockSigningNotice, buildSendData)
  // ... (생략, 앞서 작성한 코드와 동일) ...

  const buildSendData = (approvalKey: string, cmd: string): string => {
    let tr_id = ''
    let tr_type = ''
    let tr_key = ''

    switch (cmd) {
      case '1':
        tr_id = 'H0STASP0'
        tr_type = '1'
        tr_key = STOCK_CODE
        break
      case '2':
        tr_id = 'H0STASP0'
        tr_type = '2'
        tr_key = STOCK_CODE
        break
      case '3':
        tr_id = 'H0STCNT0'
        tr_type = '1'
        tr_key = STOCK_CODE
        break
      case '4':
        tr_id = 'H0STCNT0'
        tr_type = '2'
        tr_key = STOCK_CODE
        break
      case '5':
        tr_id = 'H0STCNI0'
        tr_type = '1'
        tr_key = HTS_ID
        break
      case '6':
        tr_id = 'H0STCNI0'
        tr_type = '2'
        tr_key = HTS_ID
        break
      case '7':
        tr_id = 'H0STCNI9'
        tr_type = '1'
        tr_key = HTS_ID
        break
      case '8':
        tr_id = 'H0STCNI9'
        tr_type = '2'
        tr_key = HTS_ID
        break
      default:
        logMessage('잘못된 명령입니다.')
        break
    }

    const message = {
      header: {
        approval_key: approvalKey,
        custtype: CUSTTYPE,
        tr_type: tr_type,
        'content-type': 'utf-8',
      },
      body: {
        input: {
          tr_id: tr_id,
          tr_key: tr_key,
        },
      },
    }
    return JSON.stringify(message)
  }

  // 📌 수신한 WebSocket 데이터를 StockData[] 형태로 변환하는 함수 추가
  const parseStockData = (rawData: string): StockData[] => {
    const parts = rawData.split('|')
    if (parts.length < 4) return []
  
    const stockInfo = parts[3].split('^') // 주식 데이터 분할
    const currentTime = new Date()
    const currentMinute = currentTime.toISOString().slice(0, 16) // "YYYY-MM-DD HH:mm" (분 단위 그룹화)
  
    const price = parseFloat(stockInfo[3]) // 현재가 가져오기
  
    return [{ timestamp: currentMinute, price }]
  }
  

  const connectWebSocket = key => {
    if (!key) {
      logMessage('승인키가 없습니다. 먼저 승인키를 요청하세요.')
      return
    }
    const ws = new WebSocket(WS_URL)
    wsRef.current = ws
  
    ws.onopen = () => {
      logMessage('✅ 웹소켓 연결됨')
      const sendData = buildSendData(key, command)
      logMessage('📨 전송 메시지: ' + sendData)
      ws.send(sendData)
    }
  
    ws.onmessage = event => {
      const data = event.data
      logMessage('📩 수신 데이터: ' + data)
  
      try {
        const stockData = parseStockData(data)
        if (stockData.length > 0) {
          setStockData(prev => {
            if (prev.length === 0) return stockData
  
            const lastCandle = prev[prev.length - 1] // 마지막 분봉
            const currentTime = stockData[0].timestamp // 새로 들어온 데이터의 분봉 시간
  
            if (lastCandle.timestamp === currentTime) {
              // 🔹 현재 분봉의 가격 업데이트 (현재가 변동 반영)
              return prev.map(candle =>
                candle.timestamp === currentTime ? { ...candle, price: stockData[0].price } : candle
              )
            } else {
              // 🔹 1분이 지나면 새로운 분봉 추가 (이전 분봉은 고정)
              return [...prev, stockData[0]].slice(-100)
            }
          })
        }
      } catch (error) {
        logMessage(`⚠️ 데이터 변환 실패: ${error}`)
      }
    }
  
    ws.onerror = event => {
      logMessage('⚠️ 웹소켓 오류: ' + event)
    }
  
    ws.onclose = event => {
      logMessage('❌ 웹소켓 연결 종료됨')
    }
  }
  

  useEffect(() => {
    async function initWebSocket() {
      const key = await getApprovalKey()
      if (key) {
        connectWebSocket(key)
      }
    }
    initWebSocket()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      {/* <div style={{ marginBottom: '10px' }}>
        <label>명령 선택: </label>
        <select value={command} onChange={(e) => setCommand(e.target.value)}>
          <option value="1">1: 주식호가 등록</option>
          <option value="2">2: 주식호가 해제</option>
          <option value="3">3: 주식체결 등록</option>
          <option value="4">4: 주식체결 해제</option>
          <option value="5">5: 주식체결통보 등록(고객)</option>
          <option value="6">6: 주식체결통보 해제(고객)</option>
          <option value="7">7: 주식체결통보 등록(모의)</option>
          <option value="8">8: 주식체결통보 해제(모의)</option>
        </select>
      </div> */}
      {/* <div style={{ marginTop: '20px', backgroundColor: '#f0f0f0', padding: '10px', maxHeight: '400px', overflowY: 'scroll' }}>
        <h2>로그</h2>
        {logs.map((msg, idx) => (
          <div key={idx} style={{ whiteSpace: 'pre-wrap' }}>
            {msg}
          </div>
        ))}
      </div> */}
    </div>
  )
}
