'use client'

import React, { useState, useRef } from 'react';
import CryptoJS from 'crypto-js';

const StockWebSocket: React.FC = () => {
  // 상태값
  const [approvalKey, setApprovalKey] = useState<string>('');
  const [command, setCommand] = useState<string>('1');
  const [logs, setLogs] = useState<string[]>([]);
  const [aesKey, setAesKey] = useState<string>('');
  const [aesIv, setAesIv] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);

  // API 및 기타 설정 – 실제 발급받은 값으로 교체하세요.
  const APP_KEY = 'PSwe3ujBHox6dMb5g67Kd3dGsSJLJSfonvmo';
  const APP_SECRET = 'KLJ95COYVH93NKEPerariwh5E5rZn7oqshnt2alqxOXJeS+EC6Ba/A/T3spAeXzfAb7C7NBUN5grJZTcmGdB+sjKiuVljZMXdhUzNrv+UE6AiTtuK+OHx51XYZucbLgolnf9bH+iMXE/5VDWibmrvIyID80ol0OQxqtwivEgxH';
  const STOCK_CODE = '005930'; // 예시: 삼성전자
  const HTS_ID = 'YOUR_HTSID'; // 체결통보용 HTS ID
  const CUSTTYPE = 'P'; // 개인: 'P', 법인: 'B'
  // 승인키 요청 URL
  const APPROVAL_URL = 'https://openapi.koreainvestment.com:9443/oauth2/Approval';
  // 웹소켓 URL – 실전투자 또는 모의투자 선택
  const WS_URL = 'ws://ops.koreainvestment.com:31000';

  // 로그 출력 함수
  const logMessage = (msg: string) => {
    setLogs(prev => [...prev, msg]);
    console.log(msg);
  };

  // AES256 CBC 복호화 (crypto-js 사용)
  const aesCbcBase64Dec = (key: string, iv: string, cipherText: string): string => {
    const keyHex = CryptoJS.enc.Utf8.parse(key);
    const ivHex = CryptoJS.enc.Utf8.parse(iv);
    const decrypted = CryptoJS.AES.decrypt(cipherText, keyHex, {
      iv: ivHex,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  };

  // 승인키 요청 함수 (fetch 사용)
  const getApprovalKey = async () => {
    const body = {
      grant_type: 'client_credentials',
      appkey: APP_KEY,
      secretkey: APP_SECRET,
    };

    try {
      const response = await fetch(APPROVAL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.approval_key) {
        setApprovalKey(data.approval_key);
        logMessage(`approval_key: ${data.approval_key}`);
      } else {
        logMessage('승인키 응답 오류: ' + JSON.stringify(data));
      }
    } catch (error) {
      logMessage('승인키 요청 실패: ' + error);
    }
  };

  // 파이썬의 stockhoka()와 유사하게 데이터 파싱 후 로그 출력
  const processStockHoka = (data: string) => {
    const recvValue = data.split('^');
    logMessage(`유가증권 단축 종목코드: ${recvValue[0]}`);
    logMessage(`영업시간: ${recvValue[1]} / 시간구분코드: ${recvValue[2]}`);
    logMessage('======================================');
    logMessage(`매도호가10: ${recvValue[12]}    잔량10: ${recvValue[32]}`);
    // 필요한 나머지 필드들도 동일하게 파싱하여 출력 가능
  };

  // 파이썬의 stockspurchase()와 유사하게 처리
  const processStockSpurchase = (dataCnt: number, data: string) => {
    const menuList =
      "유가증권단축종목코드|주식체결시간|주식현재가|전일대비부호|전일대비|전일대비율|가중평균주식가격|주식시가|주식최고가|주식최저가|매도호가1|매수호가1|체결거래량|누적거래량|누적거래대금|매도체결건수|매수체결건수|순매수체결건수|체결강도|총매도수량|총매수수량|체결구분|매수비율|전일거래량대비등락율|시가시간|시가대비구분|시가대비|최고가시간|고가대비구분|고가대비|최저가시간|저가대비구분|저가대비|영업일자|신장운영구분코드|거래정지여부|매도호가잔량|매수호가잔량|총매도호가잔량|총매수호가잔량|거래량회전율|전일동시간누적거래량|전일동시간누적거래량비율|시간구분코드|임의종료구분코드|정적VI발동기준가";
    const menus = menuList.split('|');
    const pValue = data.split('^');
    let i = 0;
    for (let cnt = 0; cnt < dataCnt; cnt++) {
      logMessage(`### [${cnt + 1} / ${dataCnt}]`);
      menus.forEach((menu) => {
        logMessage(`${menu}: ${pValue[i]}`);
        i++;
      });
    }
  };

  // 파이썬의 stocksigningnotice()와 유사하게 처리
  const processStockSigningNotice = (data: string, key: string, iv: string) => {
    const menuList =
      "고객ID|계좌번호|주문번호|원주문번호|매도매수구분|정정구분|주문종류|주문조건|주식단축종목코드|체결수량|체결단가|주식체결시간|거부여부|체결여부|접수여부|지점번호|주문수량|계좌명|체결종목명|신용구분|신용대출일자|체결종목명40|주문가격";
    const menus = menuList.split('|');
    const decryptedStr = aesCbcBase64Dec(key, iv, data);
    const pValue = decryptedStr.split('^');
    menus.forEach((menu, index) => {
      logMessage(`${menu}: ${pValue[index]}`);
    });
  };

  // 명령에 따른 전송 메시지 생성 함수 (파이썬의 if/else 로직)
  const buildSendData = (approvalKey: string, cmd: string): string => {
    let tr_id = '';
    let tr_type = '';
    let tr_key = '';

    switch (cmd) {
      case '1': // 주식호가 등록
        tr_id = 'H0STASP0';
        tr_type = '1';
        tr_key = STOCK_CODE;
        break;
      case '2': // 주식호가 해제
        tr_id = 'H0STASP0';
        tr_type = '2';
        tr_key = STOCK_CODE;
        break;
      case '3': // 주식체결 등록
        tr_id = 'H0STCNT0';
        tr_type = '1';
        tr_key = STOCK_CODE;
        break;
      case '4': // 주식체결 해제
        tr_id = 'H0STCNT0';
        tr_type = '2';
        tr_key = STOCK_CODE;
        break;
      case '5': // 주식체결통보 등록(고객)
        tr_id = 'H0STCNI0';
        tr_type = '1';
        tr_key = HTS_ID;
        break;
      case '6': // 주식체결통보 해제(고객)
        tr_id = 'H0STCNI0';
        tr_type = '2';
        tr_key = HTS_ID;
        break;
      case '7': // 주식체결통보 등록(모의)
        tr_id = 'H0STCNI9';
        tr_type = '1';
        tr_key = HTS_ID;
        break;
      case '8': // 주식체결통보 해제(모의)
        tr_id = 'H0STCNI9';
        tr_type = '2';
        tr_key = HTS_ID;
        break;
      default:
        logMessage('잘못된 명령입니다.');
        break;
    }

    const message = {
      header: {
        approval_key: approvalKey,
        custtype: CUSTTYPE,
        tr_type: tr_type,
        "content-type": "utf-8",
      },
      body: {
        input: {
          tr_id: tr_id,
          tr_key: tr_key,
        },
      },
    };
    return JSON.stringify(message);
  };

  // 웹소켓 연결 및 메시지 수신 처리
  const connectWebSocket = () => {
    if (!approvalKey) {
      logMessage('승인키가 없습니다. 먼저 승인키를 요청하세요.');
      return;
    }
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      logMessage('✅ 웹소켓 연결됨');
      const sendData = buildSendData(approvalKey, command);
      logMessage('📨 전송 메시지: ' + sendData);
      ws.send(sendData);
    };

    ws.onmessage = (event) => {
      const data: string = event.data;
      logMessage('📩 수신 데이터: ' + data);

      // 데이터가 '0' 또는 '1'로 시작하는 경우 실시간 데이터 처리
      if (data[0] === '0' || data[0] === '1') {
        const recvArr = data.split('|');
        const trid0 = recvArr[1];
        if (data[0] === '0') {
          if (trid0 === 'H0STASP0') {
            logMessage('#### 주식호가 ####');
            processStockHoka(recvArr[3]);
          } else if (trid0 === 'H0STCNT0') {
            logMessage('#### 주식체결 ####');
            const dataCnt = parseInt(recvArr[2]);
            processStockSpurchase(dataCnt, recvArr[3]);
          }
        } else if (data[0] === '1') {
          if (trid0 === 'H0STCNI0' || trid0 === 'H0STCNI9') {
            logMessage('#### 주식체결통보 ####');
            if (aesKey && aesIv) {
              processStockSigningNotice(recvArr[3], aesKey, aesIv);
            } else {
              logMessage('AES 키/IV가 아직 설정되지 않음.');
            }
          }
        }
      } else {
        // JSON 형식의 응답 처리 (에러 메시지, 승인 응답, PINGPONG 등)
        try {
          const jsonObject = JSON.parse(data);
          const trid = jsonObject.header.tr_id;
          if (trid !== 'PINGPONG') {
            const rt_cd = jsonObject.body.rt_cd;
            if (rt_cd === '1') {
              logMessage(`### ERROR RETURN CODE [ ${rt_cd} ] MSG [ ${jsonObject.body.msg1} ]`);
              ws.close();
            } else if (rt_cd === '0') {
              logMessage(`### RETURN CODE [ ${rt_cd} ] MSG [ ${jsonObject.body.msg1} ]`);
              // 체결통보 응답에서 AES KEY, IV 추출
              if (trid === 'H0STCNI0' || trid === 'H0STCNI9') {
                setAesKey(jsonObject.body.output.key);
                setAesIv(jsonObject.body.output.iv);
                logMessage(`### TRID [${trid}] KEY [${jsonObject.body.output.key}] IV [${jsonObject.body.output.iv}]`);
              }
            }
          } else if (trid === 'PINGPONG') {
            logMessage(`### RECV [PINGPONG] [${data}]`);
            ws.send(data); // pong 응답
            logMessage(`### SEND [PINGPONG] [${data}]`);
          }
        } catch (error) {
          logMessage('JSON 파싱 오류: ' + error);
        }
      }
    };

    ws.onerror = (event) => {
      logMessage('⚠️ 웹소켓 오류: ' + event);
    };

    ws.onclose = (event) => {
      logMessage('❌ 웹소켓 연결 종료됨');
    };
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>한국투자증권 API WebSocket (TSX)</h1>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={getApprovalKey}>승인키 요청</button>
      </div>
      <div style={{ marginBottom: '10px' }}>
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
      </div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={connectWebSocket}>웹소켓 연결 및 명령 전송</button>
      </div>
      <div style={{ marginTop: '20px', backgroundColor: '#f0f0f0', padding: '10px', maxHeight: '400px', overflowY: 'scroll' }}>
        <h2>로그</h2>
        {logs.map((msg, idx) => (
          <div key={idx} style={{ whiteSpace: 'pre-wrap' }}>
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockWebSocket;
