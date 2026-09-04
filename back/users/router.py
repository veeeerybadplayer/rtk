from fastapi import APIRouter, HTTPException, Depends, Response

from rtk.back.users.uservices import UService
from rtk.back.users.schemas import SUser, SLogin
from rtk.back.users import authreg


router = APIRouter(
    tags=["users"]
)


@router.post("/register")
async def reg_user(user_data: SUser):
    existing_user = await UService.find_one_or_none(
        email=user_data.email
    )

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Юзер уже есть"
        )

    hashed_password = authreg.get_pwd_hash(
        user_data.pwd_h
    )

    await UService.add(
        fio=user_data.fio,
        rank=user_data.rank,
        email=user_data.email,
        password_hash=hashed_password,
    )

    return {
        "message": "Пользователь успешно зарегистрирован"
    }


@router.post("/login")
async def login_user(
    requiredata: SLogin,
    response: Response,
):
    user = await authreg.authenticate_user(
        email=requiredata.email,
        password=requiredata.password,
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Неверный email или пароль",
        )

    tokens = authreg.create_tokens_pair(
        user_id=user.id
    )

    # Access token
    response.set_cookie(
        key=authreg.ACCESS_COOKIE,
        value=tokens["access_token"],
        httponly=True,
        secure=False,       # True in production with HTTPS
        samesite="lax",
        max_age=authreg.a_token_lifetime * 60,
        path="/",
    )

    # Refresh token
    response.set_cookie(
        key=authreg.REFRESH_COOKIE,
        value=tokens["refresh_token"],
        httponly=True,
        secure=False,       # True in production with HTTPS
        samesite="lax",
        max_age=authreg.r_token_lifetime * 24 * 60 * 60,
        path="/",
    )

    return {
        "message": "Успешный вход",
        "user": {
            "id": user.id,
            "email": user.email,
            "fio": user.fio,
            "rank": user.rank,
        },
    }


@router.post("/refresh")
async def refresh_token(
    response: Response,
    request_user=Depends(
        authreg.get_current_user_from_refresh_token
    ),
):
    new_access_token = authreg.create_access_token({
        "sub": str(request_user.id)
    })

    response.set_cookie(
        key=authreg.ACCESS_COOKIE,
        value=new_access_token,
        httponly=True,
        secure=False,       # True in production
        samesite="lax",
        max_age=authreg.a_token_lifetime * 60,
        path="/",
    )

    return {
        "message": "Access token обновлен"
    }


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
        key=authreg.ACCESS_COOKIE,
        path="/",
    )

    response.delete_cookie(
        key=authreg.REFRESH_COOKIE,
        path="/",
    )

    return {
        "message": "Выход выполнен"
    }


@router.get("/get_info")
async def get_u_and_t(
    current_user=Depends(authreg.get_current_user),
):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "fio": current_user.fio,
        "rank": current_user.rank,
    }