from sqlalchemy import insert, select, delete
from rtk.back.db import async_session_maker

class BaseService:
    model = None

    @classmethod
    async def find_by_id(cls, model_id: int):
        async with async_session_maker() as session:
            query = select(cls.model).filter_by(id=model_id)
            result = await session.execute(query)
            return result.scalar_one_or_none()

    @classmethod
    async def find_one_or_none(cls, **filter_by):
        async with async_session_maker() as session:
            query = select(cls.model).filter_by(**filter_by)
            result = await session.execute(query)
            return result.scalar_one_or_none()
        
    @classmethod
    async def find_all(cls, **filter_by):
        async with async_session_maker() as session:
            query = select(cls.model.__table__.columns).filter_by(**filter_by)
            result = await session.execute(query)
            return result.mappings().all()
        
    @classmethod
    async def add(cls, **data):
        async with async_session_maker() as session:
            query = insert(cls.model).values(**data) # по дефолту возвращается None, для показательности можно дописать .returning(cls.model.id)
            await session.execute(query)
            await session.commit()
    
    @classmethod
    async def delete(cls, id: int):
        async with async_session_maker() as session:
            query = delete(cls.model).where(cls.model.id == id)
            await session.execute(query)
            await session.commit()
