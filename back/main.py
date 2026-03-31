from fastapi import FastAPI
from rtk.back.users import router as RUser
from rtk.back.qrgen import router as Rqr

app = FastAPI()
app.include_router(RUser)
app.include_router(Rqr)