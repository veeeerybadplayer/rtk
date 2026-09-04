from datetime import datetime, timezone

from sqlalchemy import delete, insert, select

from rtk.back.db import async_session_maker
from rtk.back.qrgen.model import MQRCode


class QRService:
    model = MQRCode

    @classmethod
    async def create(
        cls,
        token: str,
        user_id: int,
        expires_at: datetime,
    ) -> None:
        async with async_session_maker() as session:
            query = insert(cls.model).values(
                token=token,
                user_id=user_id,
                created_at=datetime.now(timezone.utc),
                expires_at=expires_at,
            )

            await session.execute(query)
            await session.commit()

    @classmethod
    async def find_by_token(cls, token: str):
        async with async_session_maker() as session:
            query = select(cls.model).where(
                cls.model.token == token
            )

            result = await session.execute(query)
            return result.scalar_one_or_none()

    @classmethod
    async def consume(cls, token: str):
        """
        Atomically delete the QR code if it exists and has not expired.

        Returns:
            user_id if the QR was valid
            None if it did not exist or was expired
        """
        async with async_session_maker() as session:
            now = datetime.now(timezone.utc)

            query = (
                delete(cls.model)
                .where(
                    cls.model.token == token,
                    cls.model.expires_at > now,
                )
                .returning(cls.model.user_id)
            )

            result = await session.execute(query)
            user_id = result.scalar_one_or_none()

            await session.commit()

            return user_id