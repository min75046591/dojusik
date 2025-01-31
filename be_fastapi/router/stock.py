from fastapi import FastAPI, APIRouter, Request
from fastapi.templating import Jinja2Templates
from service import stock_service

import os

stock_router = APIRouter(prefix="/stock", tags=["stock"])

templates = Jinja2Templates(directory="templates")

# 특정 주식 조회
@stock_router.get("/")
async def stock_main(request: Request):
    return templates.TemplateResponse("ws_stock.html", context={"request": request})

@stock_router.get("/search/{stock_name}")
async def searchById(stock_name):
    data = await stock_service.searchByIdService(stock_name)
    return data

# 특정 주식 매수
@stock_router.post("/buy/{stock_id}")
async def buy(stock_id):
    data = await stock_service.searchByIdService(stock_id)
    return data

# 거래대금 top 10
@stock_router.get("/top10-value")
async def valueTop():
    return {"message": "here is stock/top10-value"}

# 거래량
@stock_router.get("/top10-volume")
async def volumeTop():
    return {"message": "here is stock/top10-volume"}

# 인기 급상승 주식
@stock_router.get("/top10-up")
async def upTop():
    return {"message": "here is stock/top10-up"}

# 인기 급하락 주식
@stock_router.get("/top10-down")
async def downTop():
    return {"message": "here is stock/top10-down"}