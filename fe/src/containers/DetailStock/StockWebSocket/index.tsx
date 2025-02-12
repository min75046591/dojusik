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

  const connectWebSocket = (key: string) => {
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

    ws.onmessage = (event) => {
      const data: string = event.data
      logMessage('📩 수신 데이터: ' + data)

      // 여기에 주식 정보가 있다고 가정하고, 파싱한 후 부모의 setStockData를 호출
      // 예시: 데이터가 JSON 형태로 { timestamp: string, price: number }라면...
      try {
        const jsonData = JSON.parse(data)
        // 예시: jsonData.stockData를 받아온다고 가정 (실제 데이터 포맷에 맞게 수정)
        if (jsonData.stockData) {
          setStockData(prev => [...prev, ...jsonData.stockData])
        }
      } catch (error) {
        // 기존의 주식호가, 체결 데이터 처리 로직
        if (data[0] === '0' || data[0] === '1') {
          const recvArr = data.split('|')
          const trid0 = recvArr[1]
          if (data[0] === '0') {
            if (trid0 === 'H0STASP0') {
              logMessage('#### 주식호가 ####')
              // processStockHoka(recvArr[3])
            } else if (trid0 === 'H0STCNT0') {
              logMessage('#### 주식체결 ####')
              const dataCnt = parseInt(recvArr[2])
              // processStockSpurchase(dataCnt, recvArr[3])
              // 예시: 주식체결 데이터가 있다면 부모의 setStockData 호출
              const newStock: StockData = {
                timestamp: new Date().toISOString(),
                price: parseFloat(recvArr[3]) // 실제 값 파싱에 맞게 수정
              }
              setStockData(prev => [...prev, newStock])
            }
          } else if (data[0] === '1') {
            if (trid0 === 'H0STCNI0' || trid0 === 'H0STCNI9') {
              logMessage('#### 주식체결통보 ####')
              // processStockSigningNotice(recvArr[3], aesKey, aesIv)
            }
          }
        }
      }
    }

    ws.onerror = (event) => {
      logMessage('⚠️ 웹소켓 오류: ' + event)
    }

    ws.onclose = (event) => {
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
