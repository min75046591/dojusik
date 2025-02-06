from fastapi import FastAPI, APIRouter
from router.stock import stock_router
from fastapi.staticfiles import StaticFiles

app = FastAPI()
routers = APIRouter()

@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI app!"}

app.include_router(router=stock_router)
app.mount("/static", StaticFiles(directory="static"), name="static")