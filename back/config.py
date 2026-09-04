from pathlib import Path

from pydantic import model_validator, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DB_host: str
    DB_port: str
    DB_user: str
    DB_pass: str
    DB_name: str    
    DB_URL: str = ""  # Add this field to store the composed URL
    crypt_key: str
    crypt_algo: str

    # Абсолютный путь, чтобы .env находился независимо от текущей
    # рабочей директории (импорт пакета требует запуска из rtk-case,
    # на уровень выше, а не из back/)
    model_config = SettingsConfigDict(env_file=Path(__file__).resolve().parent / ".env")

    @model_validator(mode="after")
    def get_db_url(self):
        self.DB_URL = (
            f"postgresql+asyncpg://{self.DB_user}:{self.DB_pass}"
            f"@{self.DB_host}:{self.DB_port}/{self.DB_name}")
        return self

    RDS_host: str 
    RDS_port: str

settings = Settings()