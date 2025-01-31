from typing import Dict
import httpx


async def searchByIdService(stock_name):
    # 주식 이름을 가지고 종목 코드로 변환하는 로직 필요
    stockId = '005930'
    url = 'https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/quotations/inquire-price'
    headers = {
        "Content-Type":"application/json", 
            "authorization": 'Bearer ', # 토큰 입력
            "appKey": '', # 앱 키 입력
            "appSecret": '', # 시크릿 키 입력
            "tr_id":"FHKST01010100"}
    params = {
        "fid_cond_mrkt_div_code":"J",
        "fid_input_iscd": stockId
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, params=params)
        data = response.json()
    return data

async def sellStockService(stock_id):
    url = 'https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/trading/order-cash'
    headers = {
        "Content-Type":"application/json", 
            "authorization": 'Bearer', # 토큰 입력
            "appKey": '', # 앱 키 입력
            "appSecret": '', # 시크릿 키 입력
            "tr_id":"VTTC0802U"}
    body = {
        "CANO": "",
        "ACNT_PRDT_CD": "01",
        "PDNO": f"{stock_id}",
        "ORD_DVSN": "00",
        "ORD_QTY": "1",
        "ORD_UNPR": "55000"
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=body)
        data = response.json()
    return data