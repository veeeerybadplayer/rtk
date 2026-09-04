from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from rtk.back.db import Base, engine
from rtk.back.users.router import router as RUser
from rtk.back.qrgen.router import router as Rqr

# Модели должны быть импортированы до create_all, иначе их таблицы не попадут в metadata
from rtk.back.users import model as _user_model  # noqa: F401
from rtk.back.qrgen import model as _qr_model  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    # Vite в деве может занять любой порт, если 3000 уже занят (3001, 3002...),
    # поэтому разрешаем localhost/127.0.0.1 на любом порту, а не один фиксированный
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(RUser)
app.include_router(Rqr)
