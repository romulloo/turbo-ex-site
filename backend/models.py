from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime, timezone
from database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    brand = Column(String, nullable=False)
    category = Column(String, nullable=False)  # "nova", "recondicionada"
    application = Column(String, nullable=False)  # "caminhao", "carro", "agricola", "industrial"
    image_url = Column(String, nullable=True)
    whatsapp_message = Column(String, nullable=True)  # custom override, null = use default template
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Seller(Base):
    __tablename__ = "sellers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    photo_url = Column(String, nullable=True)
    whatsapp = Column(String, nullable=False)  # "5541999999999" format
    coverage = Column(String, nullable=False)  # "curitiba" or "brasil"


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String, nullable=False)  # lucide-react icon name
