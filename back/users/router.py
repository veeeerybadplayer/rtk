from fastapi import APIRouter, HTTPException
from rtk.back.users.uservices

router = APIRouter(tags="/users")

@router.post("/register")
async def reg_user(user_data: SUserAuthReg):
    existing_user = await uservices.find_one_or_none(email = user_data.email)
    if existing_user:
        raise HTTPException(status_code=409, detail="Юзер уже есть")
    hashed_password = get_password_hash(user_data.password)
    await uservices.add(email=user_data.email, hashed_password=hashed_password)