from fastapi import APIRouter

router = APIRouter(tags="/quar-generation")

@router.post
def generation():
    pass