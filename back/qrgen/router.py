import base64
import io
import secrets
from datetime import datetime, timedelta, timezone

import qrcode
from fastapi import APIRouter, Depends, HTTPException, status

from rtk.back.users.authreg import get_current_user
from rtk.back.qrgen.schemas import SQRCode, SScan
from rtk.back.qrgen.qrservice import QRService


router = APIRouter(
    prefix="/qr",
    tags=["qr-generation"],
)

QR_LIFETIME_MINUTES = 5


def get_data_for_code() -> str:
    """
    Generate a cryptographically secure one-time token.
    """
    return secrets.token_urlsafe(32)


@router.post(
    "/generation",
    response_model=SQRCode,
)
async def generation(
    current_user=Depends(get_current_user),
):

    token = get_data_for_code()

    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=QR_LIFETIME_MINUTES
    )

    await QRService.create(
        token=token,
        user_id=current_user.id,
        expires_at=expires_at,
    )

    # Generate QR image
    qr = qrcode.QRCode(
        version=1,
        box_size=10,
        border=4,
    )

    qr.add_data(token)
    qr.make(fit=True)

    image = qr.make_image()

    buffer = io.BytesIO()
    image.save(buffer, format="PNG")

    qr_base64 = base64.b64encode(
        buffer.getvalue()
    ).decode("utf-8")

    return {
        "token": token,
        "qr_code": qr_base64,
        "expires_at": expires_at,
    }


@router.post("/cancel")
async def cancel(
    current_user=Depends(get_current_user),
):
    cancelled = await QRService.cancel_for_user(current_user.id)

    if not cancelled:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Активный пропуск не найден",
        )

    return {
        "success": True,
        "message": "Пропуск отменён",
    }


@router.post(
    "/scan",
)
async def scan(data: SScan):
    user_id = await QRService.consume(data.token)

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="QR code is invalid or expired",
        )

    return {
        "success": True,
        "message": "Entry allowed",
        "user_id": user_id,
    }