from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, Request, status
from jose import JWTError, jwt
from pydantic import EmailStr
from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher

from rtk.back.config import settings
from rtk.back.users.uservices import UService


pwd_h = PasswordHash((Argon2Hasher(),))

a_token_lifetime = 30       # minutes
r_token_lifetime = 7        # days


def get_pwd_hash(pwd: str) -> str:
    return pwd_h.hash(pwd)


def verify_pwd(pwd: str, h_pwd: str) -> bool:
    try:
        return pwd_h.verify(pwd, h_pwd)
    except Exception:
        return False


def create_access_token(data: dict) -> str:
    to_encode = data.copy()

    expire = (
        datetime.now(timezone.utc)
        + timedelta(minutes=a_token_lifetime)
    )

    to_encode.update({
        "exp": expire,
        "type": "access",
    })

    return jwt.encode(
        to_encode,
        settings.crypt_key,
        settings.crypt_algo,
    )


def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()

    expire = (
        datetime.now(timezone.utc)
        + timedelta(days=r_token_lifetime)
    )

    to_encode.update({
        "exp": expire,
        "type": "refresh",
    })

    return jwt.encode(
        to_encode,
        settings.crypt_key,
        settings.crypt_algo,
    )


def create_tokens_pair(user_id: int) -> dict[str, str]:
    token_data = {
        "sub": str(user_id)
    }

    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
    }


async def authenticate_user(email: EmailStr, password: str):
    user = await UService.find_one_or_none(email=email)

    if not user:
        return None

    if not verify_pwd(password, user.password_hash):
        return None

    return user


# ---------------------------------------------------------
# COOKIE AUTHENTICATION
# ---------------------------------------------------------

ACCESS_COOKIE = "access_token"
REFRESH_COOKIE = "refresh_token"


async def get_access_token_from_cookie(request: Request) -> str:
    """
    Extract access token from HttpOnly cookie.
    """
    token = request.cookies.get(ACCESS_COOKIE)

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token отсутствует",
        )

    return token


async def get_current_user(
    request: Request,
):
    """
    Get access token from cookie, validate it,
    and make sure the user still exists in PostgreSQL.
    """

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось валидировать учетные данные",
    )

    token = request.cookies.get(ACCESS_COOKIE)

    if not token:
        raise credentials_exception

    try:
        payload = jwt.decode(
            token,
            settings.crypt_key,
            algorithms=[settings.crypt_algo],
        )

        # Access endpoint must receive access token
        if payload.get("type") != "access":
            raise credentials_exception

        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

        user_id = int(user_id)

    except (JWTError, ValueError, TypeError):
        raise credentials_exception

    # Check that user still exists in DB
    user = await UService.find_by_id(user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден",
        )

    return user


async def get_refresh_token_from_cookie(
    request: Request,
) -> str:
    """
    Extract refresh token from HttpOnly cookie.
    """

    token = request.cookies.get(REFRESH_COOKIE)

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token отсутствует",
        )

    return token


async def get_current_user_from_refresh_token(
    request: Request,
):
    """
    Validate refresh token and check user existence.
    """

    token = await get_refresh_token_from_cookie(request)

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Недействительный refresh token",
    )

    try:
        payload = jwt.decode(
            token,
            settings.crypt_key,
            algorithms=[settings.crypt_algo],
        )

        if payload.get("type") != "refresh":
            raise credentials_exception

        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

        user_id = int(user_id)

    except (JWTError, ValueError, TypeError):
        raise credentials_exception

    user = await UService.find_by_id(user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден",
        )

    return user


async def refresh_access_token(
    request: Request,
) -> str:
    """
    Validate refresh token from cookie and issue a new access token.
    """
    user = await get_current_user_from_refresh_token(request)

    return create_access_token({
        "sub": str(user.id)
    })