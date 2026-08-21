from datetime import datetime
from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from rtk.back.db import Base

class MUser(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)

    fio: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    rank: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    password_hash: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    last_entered: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )