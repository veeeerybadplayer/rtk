from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from rtk.back.config import settings