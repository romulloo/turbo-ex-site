from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Seller
from schemas import SellerOut

router = APIRouter(prefix="/api/sellers", tags=["sellers"])


@router.get("", response_model=list[SellerOut])
def get_sellers(db: Session = Depends(get_db)):
    return db.query(Seller).all()
