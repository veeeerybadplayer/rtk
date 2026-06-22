from fastapi import FastAPI
from rtk.back.users.router import router as RUser
from rtk.back.qrgen.router import router as Rqr

app = FastAPI()
app.include_router(RUser)
app.include_router(Rqr)