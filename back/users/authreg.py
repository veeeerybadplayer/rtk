from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher
from rtk.back.config import settings
from pydantic import EmailStr
from rtk.back.users import uservices

pwd_h = PasswordHash((Argon2Hasher(),))
a_token_lifetime = 30
r_token_lifetime = 7

def get_pwd_hash(pwd: str) -> str:
    return pwd_h.hash(pwd)

def verify_pwd(pwd: str, h_pwd: str) -> bool:
    try:
        return pwd_h.verify(pwd, h_pwd)
    except Exception:
        return False
    
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=a_token_lifetime)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.crypt_key, settings.crypt_algo)


def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=r_token_lifetime)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.crypt_key, settings.crypt_algo)


def create_tokens_pair(user_id: str) -> dict[str, str]:
    token_data = {"sub": str(user_id)}
    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
    }


async def authenticate_user(email: EmailStr, password: str):
    user = await uservices.find_one_or_none(email=email)
    if not (user and verify_pwd(password, user.hashed_password)):
        raise Exception
    return user


def refresh_access_token(refresh_token: str) -> str:
    try:
        payload = jwt.decode(
            refresh_token, settings.crypt_key, algorithms=[settings.crypt_algo]
        )
        if payload.get("type") != "refresh":
            raise JWTError("Неправильный тип токена")
            
        user_id = payload.get("sub")
        if user_id is None:
            raise JWTError("Неверная подпись токена")
            
        return create_access_token(data={"sub": user_id})
    except JWTError as e:
        raise e
    
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

async def get_current_user_and_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось валидировать учетные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.crypt_key, algorithms=[settings.crypt_algo])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Неправильный тип токена")
            
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await uservices.find_one_or_none(id=int(user_id))
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
        
    return user, token