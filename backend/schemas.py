from pydantic import BaseModel
from datetime import datetime


class ProductOut(BaseModel):
    id: int
    name: str
    description: str | None
    brand: str
    category: str
    application: str
    image_url: str | None
    whatsapp_message: str | None
    is_featured: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class SellerOut(BaseModel):
    id: int
    name: str
    description: str | None
    photo_url: str | None
    whatsapp: str
    coverage: str

    model_config = {"from_attributes": True}


class ServiceOut(BaseModel):
    id: int
    title: str
    description: str | None
    icon: str

    model_config = {"from_attributes": True}
