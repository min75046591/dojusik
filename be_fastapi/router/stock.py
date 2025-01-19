from fastapi import FastAPI, APIRouter, Request
from fastapi.templating import Jinja2Templates

import os

stock_router = APIRouter()

templates = Jinja2Templates(directory="templates")

@stock_router.get("/stock")
async def stock_main(request: Request):
    return templates.TemplateResponse("ws_stock.html", context={"request": request})