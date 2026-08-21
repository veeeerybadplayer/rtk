from pydantic import BaseModel, EmailStr
from datetime import datetime

class SUser(BaseModel):
    fio: str
    rank: str
    email: EmailStr
    pwd_h: str
    last_entry: datetime

class SLogin(BaseModel):
    email: EmailStr
    password: str
