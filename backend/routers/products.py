from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Product
from schemas import ProductOut

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("/featured", response_model=list[ProductOut])
def get_featured_products(db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.is_featured == True).all()


@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("", response_model=list[ProductOut])
def get_products(
    category: str | None = Query(None),
    brand: str | None = Query(None),
    application: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Product)
    if category:
        query = query.filter(Product.category == category)
    if brand:
        query = query.filter(Product.brand == brand)
    if application:
        query = query.filter(Product.application == application)
    return query.order_by(Product.created_at.desc()).all()
