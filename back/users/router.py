from fastapi import APIRouter

router = APIRouter(tags="/users")

@router.post
def create_user()