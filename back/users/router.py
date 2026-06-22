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
    return {"message": "Пользователь успешно зарегистрирован"}

@router.post("/login")
async def login_user(email: str, password: str):
    user = await authreg.authenticate_user(email, password)
    if not user:
        raise HTTPException(status_code=401, detail="Неверный email или пароль")
    
    tokens = authreg.create_tokens_pair(user_id=user.id)
    
    return {
        "access_token": tokens["access_token"],
        "refresh_token": tokens["refresh_token"],
        "user": {
            "id": user.id,
            "email": user.email,
            "fio": user.fio,
            "rank": user.rank
        }
    }