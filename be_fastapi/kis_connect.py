import httpx
import os
from dotenv import load_dotenv
import asyncio

load_dotenv()
realurl = "https://openapivts.koreainvestment.com:9443"
demourl = "https://openapivts.koreainvestment.com:29443"

# 웹소켓 접근 키
async def getApprovalKey():
    path = "/oauth2/Approval"
    headers = {'Content-Type':'application/json'}
    body = {
        "grant_type":"client_credentials",
        "appkey":os.environ.get("D_APP_KEY"),
        "secretkey":os.environ.get("D_APP_SECRET_KEY")
        }
    async with httpx.AsyncClient() as client:
        response = await client.post(demourl+path, headers=headers, json=body)
        data = response.json()
    return data

# 접근 토큰 발급
async def getAccessToken():
    path = "/oauth2/tokenP"
    headers = {'Content-Type':'application/json'}
    body = {
        "grant_type":"client_credentials",
        "appkey":os.environ.get("D_APP_KEY"),
        "appsecret":os.environ.get("D_APP_SECRET_KEY")
        }
    async with httpx.AsyncClient() as client:
        response = await client.post(demourl+path, headers=headers, json=body)
        data = response.json()
    return data