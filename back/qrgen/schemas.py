from datetime import datetime

from pydantic import BaseModel


class SQRCode(BaseModel):
    token: str
    qr_code: str
    expires_at: datetime


class SScan(BaseModel):
    token: str