from fastapi import APIRouter, HTTPException
from rtk.back.users import uservices
from rtk.back.users.schemas import SUser
from rtk.back.users import authreg

router = APIRouter(tags=["/users"])

@router.post("/register")
async def reg_user(user_data: SUser):
    existing_user = await uservices.find_one_or_none(email = user_data.email)
    if existing_user:
        raise HTTPException(status_code=409, detail="Юзер уже есть")
    hashed_password = authreg.get_pwd_hash(user_data.pwd)
    await uservices.add(fio=user_data.fio, rank=user_data.rank, email=user_data.email, hashed_password=hashed_password)