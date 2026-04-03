from pydantic import BaseModel, EmailStr
from datetime import datetime

class SUser(BaseModel):
    fio: str
    rank: str
    email: EmailStr
    pwd: str
    last_entry: datetime
