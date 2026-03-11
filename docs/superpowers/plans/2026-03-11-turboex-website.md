# TurboEX Website Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive institutional website for TurboEX turbine company with product catalog, seller profiles, and Google Maps location.

**Architecture:** Next.js 15 frontend with Tailwind v4 + Framer Motion consuming a FastAPI + SQLite backend. Both services run in Docker Compose. Frontend proxies `/api/*` and `/uploads/*` to backend.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Python 3.12, FastAPI, SQLAlchemy, SQLite, Docker

**Spec:** `docs/superpowers/specs/2026-03-11-turboex-website-design.md`

---

## File Structure

### Backend (`backend/`)
| File | Responsibility |
|------|---------------|
| `main.py` | FastAPI app, CORS, mount uploads, include routers, startup event (create_all + seed) |
| `database.py` | SQLAlchemy engine (`data/turboex.db`), SessionLocal, Base |
| `models.py` | Product, Seller, Service SQLAlchemy models |
| `schemas.py` | Pydantic response schemas |
| `routers/products.py` | GET /api/products, /api/products/featured, /api/products/{id} |
| `routers/sellers.py` | GET /api/sellers |
| `routers/services.py` | GET /api/services |
| `seed.py` | Seed services + placeholder sellers on first run |
| `requirements.txt` | fastapi, uvicorn, sqlalchemy, pydantic |
| `Dockerfile` | Python 3.12-slim, uvicorn CMD |

### Frontend (`frontend/`)
| File | Responsibility |
|------|---------------|
| `src/app/layout.tsx` | Root layout, Inter font, metadata, Navbar + Footer + WhatsAppButton |
| `src/app/page.tsx` | Home: Hero, About, Services, CatalogPreview, Sellers, Location |
| `src/app/catalogo/page.tsx` | Catalog page: FilterBar + product grid + ProductModal |
| `src/components/Navbar.tsx` | Fixed nav, glassmorphism on scroll, hamburger mobile |
| `src/components/Hero.tsx` | Parallax hero with CTA |
| `src/components/About.tsx` | About section with scroll animation |
| `src/components/Services.tsx` | Service cards grid with hover effects |
| `src/components/CatalogPreview.tsx` | Featured products + "Ver Catalogo" link |
| `src/components/Sellers.tsx` | Seller cards with photo, badge, WhatsApp |
| `src/components/Location.tsx` | Google Maps embed with 3 tabs (Map/Satellite/Street View) |
| `src/components/Footer.tsx` | Social links, hours, copyright |
| `src/components/WhatsAppButton.tsx` | Floating WhatsApp button with pulse |
| `src/components/ProductCard.tsx` | Product card with hover animation |
| `src/components/ProductModal.tsx` | Product detail modal with WhatsApp CTA |
| `src/components/FilterBar.tsx` | Category/Brand/Application filter selects |
| `src/components/ScrollAnimation.tsx` | Framer Motion viewport animation wrapper |
| `src/lib/api.ts` | Fetch functions for all API endpoints |
| `next.config.ts` | Proxy rewrites, image remotePatterns, standalone output |
| `tailwind.config.ts` | Custom colors (orange, dark grays) |
| `Dockerfile` | Multi-stage Node 20-alpine build |

### Root
| File | Responsibility |
|------|---------------|
| `docker-compose.yml` | frontend + backend services, volumes |

---

## Chunk 1: Project Setup + Backend

### Task 1: Initialize project and git repo

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/.gitkeep` files for upload dirs
- Create: `.gitignore`

- [ ] **Step 1: Init git repo**

```bash
cd C:/Users/Usuario/Documents/turbo-ex-site
git init
```

- [ ] **Step 2: Create .gitignore**

Create `.gitignore`:
```
# Python
__pycache__/
*.pyc
*.pyo
.env
*.db
*.db-wal
*.db-shm
backend/data/*
!backend/data/.gitkeep

# Node
node_modules/
.next/
frontend/.next/
frontend/node_modules/

# Uploads (user-provided content)
backend/uploads/products/*
backend/uploads/sellers/*
!backend/uploads/products/.gitkeep
!backend/uploads/sellers/.gitkeep

# OS
.DS_Store
Thumbs.db

# Docker
docker-compose.override.yml
```

- [ ] **Step 3: Create backend directory structure**

```bash
mkdir -p backend/routers backend/uploads/products backend/uploads/sellers backend/data
touch backend/uploads/products/.gitkeep backend/uploads/sellers/.gitkeep backend/data/.gitkeep
```

- [ ] **Step 4: Create requirements.txt**

Create `backend/requirements.txt`:
```
fastapi==0.115.0
uvicorn[standard]==0.32.0
sqlalchemy==2.0.36
pydantic==2.10.0
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: init project structure with backend skeleton"
```

---

### Task 2: Backend database + models

**Files:**
- Create: `backend/database.py`
- Create: `backend/models.py`
- Create: `backend/schemas.py`

- [ ] **Step 1: Create database.py**

Create `backend/database.py`:
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "data", "turboex.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

- [ ] **Step 2: Create models.py**

Create `backend/models.py`:
```python
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
```

- [ ] **Step 3: Create schemas.py**

Create `backend/schemas.py`:
```python
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
```

- [ ] **Step 4: Verify models load**

```bash
cd C:/Users/Usuario/Documents/turbo-ex-site/backend
python -c "from database import Base, engine; from models import Product, Seller, Service; Base.metadata.create_all(bind=engine); print('OK')"
```

Expected: `OK` and `data/turboex.db` file created.

- [ ] **Step 5: Commit**

```bash
git add backend/database.py backend/models.py backend/schemas.py
git commit -m "feat: add database, models (Product, Seller, Service) and schemas"
```

---

### Task 3: Seed data

**Files:**
- Create: `backend/seed.py`

- [ ] **Step 1: Create seed.py**

Create `backend/seed.py`:
```python
from sqlalchemy.orm import Session
from models import Service, Seller


def seed_services(db: Session):
    if db.query(Service).count() > 0:
        return
    services = [
        Service(title="Venda de Turbinas Novas", description="Turbinas originais e de alta performance para todos os tipos de veiculos.", icon="package"),
        Service(title="Turbinas Recondicionadas", description="Turbinas recondicionadas com garantia e qualidade assegurada.", icon="refresh-cw"),
        Service(title="Manutencao", description="Manutencao preventiva e corretiva para prolongar a vida util da sua turbina.", icon="wrench"),
        Service(title="Balanceamento", description="Balanceamento de precisao para maximo desempenho e durabilidade.", icon="gauge"),
        Service(title="Reparo", description="Reparo completo com pecas originais e mao de obra especializada.", icon="settings"),
    ]
    db.add_all(services)
    db.commit()


def seed_sellers(db: Session):
    if db.query(Seller).count() > 0:
        return
    sellers = [
        Seller(
            name="Vendedor Curitiba",
            description="Atendimento especializado para a regiao de Curitiba e regiao metropolitana.",
            photo_url=None,
            whatsapp="5541999999999",
            coverage="curitiba",
        ),
        Seller(
            name="Vendedor Brasil",
            description="Atendimento para todo o territorio nacional com envio para todo o Brasil.",
            photo_url=None,
            whatsapp="5541888888888",
            coverage="brasil",
        ),
    ]
    db.add_all(sellers)
    db.commit()


def run_seed(db: Session):
    seed_services(db)
    seed_sellers(db)
```

- [ ] **Step 2: Verify seed works**

```bash
cd C:/Users/Usuario/Documents/turbo-ex-site/backend
python -c "
from database import Base, engine, SessionLocal
from models import Product, Seller, Service
Base.metadata.create_all(bind=engine)
db = SessionLocal()
from seed import run_seed
run_seed(db)
print(f'Services: {db.query(Service).count()}')
print(f'Sellers: {db.query(Seller).count()}')
db.close()
"
```

Expected: `Services: 5` and `Sellers: 2`

- [ ] **Step 3: Commit**

```bash
git add backend/seed.py
git commit -m "feat: add seed data (5 services, 2 placeholder sellers)"
```

---

### Task 4: API routers

**Files:**
- Create: `backend/routers/__init__.py`
- Create: `backend/routers/products.py`
- Create: `backend/routers/sellers.py`
- Create: `backend/routers/services.py`

- [ ] **Step 1: Create routers/__init__.py**

Create empty `backend/routers/__init__.py`.

- [ ] **Step 2: Create products router**

Create `backend/routers/products.py`:
```python
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
```

- [ ] **Step 3: Create sellers router**

Create `backend/routers/sellers.py`:
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Seller
from schemas import SellerOut

router = APIRouter(prefix="/api/sellers", tags=["sellers"])


@router.get("", response_model=list[SellerOut])
def get_sellers(db: Session = Depends(get_db)):
    return db.query(Seller).all()
```

- [ ] **Step 4: Create services router**

Create `backend/routers/services.py`:
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Service
from schemas import ServiceOut

router = APIRouter(prefix="/api/services", tags=["services"])


@router.get("", response_model=list[ServiceOut])
def get_services(db: Session = Depends(get_db)):
    return db.query(Service).all()
```

- [ ] **Step 5: Commit**

```bash
git add backend/routers/
git commit -m "feat: add API routers (products with filters, sellers, services)"
```

---

### Task 5: Main app + backend Dockerfile

**Files:**
- Create: `backend/main.py`
- Create: `backend/Dockerfile`

- [ ] **Step 1: Create main.py**

Create `backend/main.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from database import Base, engine, SessionLocal
from seed import run_seed
from routers import products, sellers, services
import os


@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs("data", exist_ok=True)
    os.makedirs("uploads/products", exist_ok=True)
    os.makedirs("uploads/sellers", exist_ok=True)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        run_seed(db)
    finally:
        db.close()
    yield


app = FastAPI(title="TurboEX API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(products.router)
app.include_router(sellers.router)
app.include_router(services.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
```

- [ ] **Step 2: Test backend starts**

```bash
cd C:/Users/Usuario/Documents/turbo-ex-site/backend
python -m uvicorn main:app --port 8000
```

Test in another terminal:
```bash
curl http://localhost:8000/api/health
curl http://localhost:8000/api/services
curl http://localhost:8000/api/sellers
```

Expected: JSON responses with health ok, 5 services, 2 sellers.

- [ ] **Step 3: Create backend Dockerfile**

Create `backend/Dockerfile`:
```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p uploads/products uploads/sellers data

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- [ ] **Step 4: Commit**

```bash
git add backend/main.py backend/Dockerfile
git commit -m "feat: add FastAPI main app with lifespan + backend Dockerfile"
```

---

## Chunk 2: Frontend Setup + Layout

### Task 6: Initialize Next.js project

**Files:**
- Create: `frontend/` (via create-next-app)
- Modify: `frontend/next.config.ts`
- Modify: `frontend/tailwind.config.ts`

- [ ] **Step 1: Create Next.js app**

```bash
cd C:/Users/Usuario/Documents/turbo-ex-site
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --no-import-alias
```

- [ ] **Step 2: Install dependencies**

```bash
cd C:/Users/Usuario/Documents/turbo-ex-site/frontend
npm install framer-motion lucide-react
```

- [ ] **Step 3: Configure next.config.ts**

Replace `frontend/next.config.ts`:
```typescript
import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${backendUrl}/api/:path*` },
      { source: "/uploads/:path*", destination: `${backendUrl}/uploads/:path*` },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/uploads/**" },
      { protocol: "http", hostname: "localhost", port: "3000", pathname: "/uploads/**" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 4: Note on Tailwind v4 colors**

Tailwind v4 uses the `@theme` CSS directive for custom colors (configured in `globals.css` in Task 8 Step 1). No `tailwind.config.ts` customization is needed for colors — the default config generated by create-next-app is sufficient.

- [ ] **Step 5: Commit**

```bash
cd C:/Users/Usuario/Documents/turbo-ex-site
git add frontend/
git commit -m "feat: init Next.js 15 with Tailwind, Framer Motion, custom TurboEX colors"
```

---

### Task 7: API client + ScrollAnimation wrapper

**Files:**
- Create: `frontend/src/lib/api.ts`
- Create: `frontend/src/components/ScrollAnimation.tsx`

- [ ] **Step 1: Create API client**

Create `frontend/src/lib/api.ts`:
```typescript
export interface Product {
  id: number;
  name: string;
  description: string | null;
  brand: string;
  category: string;
  application: string;
  image_url: string | null;
  whatsapp_message: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface Seller {
  id: number;
  name: string;
  description: string | null;
  photo_url: string | null;
  whatsapp: string;
  coverage: string;
}

export interface Service {
  id: number;
  title: string;
  description: string | null;
  icon: string;
}

const API_BASE = "/api";

export async function fetchProducts(filters?: {
  category?: string;
  brand?: string;
  application?: string;
}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set("category", filters.category);
  if (filters?.brand) params.set("brand", filters.brand);
  if (filters?.application) params.set("application", filters.application);
  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await fetch(`${API_BASE}/products${query}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products/featured`);
  if (!res.ok) throw new Error("Failed to fetch featured products");
  return res.json();
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export async function fetchSellers(): Promise<Seller[]> {
  const res = await fetch(`${API_BASE}/sellers`);
  if (!res.ok) throw new Error("Failed to fetch sellers");
  return res.json();
}

export async function fetchServices(): Promise<Service[]> {
  const res = await fetch(`${API_BASE}/services`);
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}
```

- [ ] **Step 2: Create ScrollAnimation wrapper**

Create `frontend/src/components/ScrollAnimation.tsx`:
```typescript
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollAnimation({ children, className, delay = 0 }: ScrollAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/lib/api.ts frontend/src/components/ScrollAnimation.tsx
git commit -m "feat: add API client and ScrollAnimation wrapper"
```

---

### Task 8: Root layout + Navbar + Footer + WhatsAppButton

**Files:**
- Modify: `frontend/src/app/layout.tsx`
- Modify: `frontend/src/app/globals.css`
- Create: `frontend/src/components/Navbar.tsx`
- Create: `frontend/src/components/Footer.tsx`
- Create: `frontend/src/components/WhatsAppButton.tsx`

- [ ] **Step 1: Update globals.css**

Replace `frontend/src/app/globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-turbo-orange: #ff6a00;
  --color-turbo-orange-hover: #e85f00;
  --color-turbo-dark: #0a0a0a;
  --color-turbo-card: #1a1a1a;
  --color-turbo-gray: #c0c0c0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: #0a0a0a;
  color: #ffffff;
}
```

- [ ] **Step 2: Create Navbar**

Create `frontend/src/components/Navbar.tsx`:
```typescript
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Servicos", href: "/#servicos" },
  { label: "Catalogo", href: "/catalogo" },
  { label: "Vendedores", href: "/#vendedores" },
  { label: "Localizacao", href: "/#localizacao" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setMobileOpen(false);
    if (pathname !== "/" && href.startsWith("/#")) {
      window.location.href = href;
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold tracking-wider uppercase">
            <span className="text-turbo-orange">Turbo</span>EX
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="text-sm uppercase tracking-wider text-turbo-gray hover:text-turbo-orange transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-md pb-4"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="block py-3 px-4 text-sm uppercase tracking-wider text-turbo-gray hover:text-turbo-orange transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
```

- [ ] **Step 3: Create Footer**

Create `frontend/src/components/Footer.tsx`:
```typescript
import { Instagram, Facebook, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold tracking-wider uppercase mb-4">
              <span className="text-turbo-orange">Turbo</span>EX
            </h3>
            <p className="text-turbo-gray text-sm">
              Especialistas em turbinas automotivas em Curitiba/PR.
            </p>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Horario</h4>
            <p className="text-turbo-gray text-sm">Segunda a Sexta</p>
            <p className="text-turbo-gray text-sm">08:00 - 12:00 | 13:15 - 18:00</p>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Redes Sociais</h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/turboexcwb/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-turbo-gray hover:text-turbo-orange transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://www.facebook.com/TurboEXCuritiba"
                target="_blank"
                rel="noopener noreferrer"
                className="text-turbo-gray hover:text-turbo-orange transition-colors"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://wa.me/554130959150"
                target="_blank"
                rel="noopener noreferrer"
                className="text-turbo-gray hover:text-turbo-orange transition-colors"
              >
                <Phone size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-turbo-gray text-sm">
          &copy; {new Date().getFullYear()} TurboEX. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Create WhatsAppButton**

Create `frontend/src/components/WhatsAppButton.tsx`:
```typescript
"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/554130959150"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.15 }}
      aria-label="Contato WhatsApp"
    >
      <MessageCircle size={28} />
    </motion.a>
  );
}
```

- [ ] **Step 5: Update root layout**

Replace `frontend/src/app/layout.tsx`:
```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TurboEX - Especialistas em Turbinas | Curitiba/PR",
  description:
    "Venda, manutencao, balanceamento e reparo de turbinas automotivas em Curitiba. Turbinas novas e recondicionadas com garantia.",
  openGraph: {
    title: "TurboEX - Especialistas em Turbinas",
    description: "Venda, manutencao e reparo de turbinas automotivas em Curitiba/PR.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-turbo-dark text-white`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add frontend/src/
git commit -m "feat: add root layout with Navbar, Footer, WhatsAppButton"
```

---

## Chunk 3: Home Page Sections

### Task 9: Hero section

**Files:**
- Create: `frontend/src/components/Hero.tsx`

- [ ] **Step 1: Create Hero component**

Create `frontend/src/components/Hero.tsx`:
```typescript
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";

export default function Hero() {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="inicio" ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax background (disabled on mobile for performance) */}
      <motion.div
        style={{ y: isMobile ? 0 : y }}
        className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center"
      />
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 text-center px-4">
        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-wider uppercase mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-turbo-orange">Turbo</span>EX
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-turbo-gray mb-8 tracking-wide"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Especialistas em Turbinas Automotivas
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            href="/catalogo"
            className="inline-block bg-turbo-orange hover:bg-turbo-orange-hover text-white font-bold py-3 px-8 rounded-lg text-lg uppercase tracking-wider transition-colors"
          >
            Ver Catalogo
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Add placeholder hero image**

```bash
mkdir -p C:/Users/Usuario/Documents/turbo-ex-site/frontend/public/images
```

(User will provide real hero image later. For now, the dark overlay ensures it looks fine even without the image.)

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Hero.tsx
git commit -m "feat: add Hero section with parallax and CTA"
```

---

### Task 10: About section

**Files:**
- Create: `frontend/src/components/About.tsx`

- [ ] **Step 1: Create About component**

Create `frontend/src/components/About.tsx`:
```typescript
import ScrollAnimation from "./ScrollAnimation";

export default function About() {
  return (
    <section id="sobre" className="py-24 bg-turbo-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <h2 className="text-3xl md:text-4xl font-bold text-center uppercase tracking-wider mb-12">
            Sobre a <span className="text-turbo-orange">TurboEX</span>
          </h2>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <ScrollAnimation delay={0.2}>
            <p className="text-turbo-gray text-lg leading-relaxed">
              A TurboEX e referencia em turbinas automotivas em Curitiba e regiao.
              Com anos de experiencia no mercado, oferecemos servicos completos de
              venda, manutencao, balanceamento e reparo de turbinas para todos os
              tipos de veiculos.
            </p>
            <p className="text-turbo-gray text-lg leading-relaxed mt-4">
              Trabalhamos com as principais marcas do mercado e contamos com uma
              equipe altamente qualificada para garantir o maximo desempenho do
              seu turbo.
            </p>
          </ScrollAnimation>

          <ScrollAnimation delay={0.4}>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "1000+", label: "Turbinas Vendidas" },
                { value: "500+", label: "Clientes Satisfeitos" },
                { value: "10+", label: "Anos de Experiencia" },
                { value: "100%", label: "Garantia" },
              ].map((stat) => (
                <div key={stat.label} className="bg-turbo-card rounded-xl p-6 text-center border border-white/5">
                  <p className="text-3xl font-bold text-turbo-orange">{stat.value}</p>
                  <p className="text-turbo-gray text-sm mt-2 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/About.tsx
git commit -m "feat: add About section with stats cards"
```

---

### Task 11: Services section

**Files:**
- Create: `frontend/src/components/Services.tsx`

- [ ] **Step 1: Create Services component**

Create `frontend/src/components/Services.tsx`:
```typescript
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, RefreshCw, Wrench, Gauge, Settings } from "lucide-react";
import { fetchServices, type Service } from "@/lib/api";
import ScrollAnimation from "./ScrollAnimation";

const ICON_MAP: Record<string, React.ElementType> = {
  package: Package,
  "refresh-cw": RefreshCw,
  wrench: Wrench,
  gauge: Gauge,
  settings: Settings,
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchServices().then(setServices).catch(console.error);
  }, []);

  return (
    <section id="servicos" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <h2 className="text-3xl md:text-4xl font-bold text-center uppercase tracking-wider mb-12">
            Nossos <span className="text-turbo-orange">Servicos</span>
          </h2>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = ICON_MAP[service.icon] || Package;
            return (
              <ScrollAnimation key={service.id} delay={index * 0.1}>
                <motion.div
                  className="bg-turbo-card rounded-xl p-8 border border-white/5 h-full"
                  whileHover={{ scale: 1.03, borderColor: "#ff6a00" }}
                  transition={{ duration: 0.2 }}
                >
                  <IconComponent className="text-turbo-orange mb-4" size={40} />
                  <h3 className="text-lg font-bold uppercase tracking-wider mb-3">{service.title}</h3>
                  <p className="text-turbo-gray text-sm leading-relaxed">{service.description}</p>
                </motion.div>
              </ScrollAnimation>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/Services.tsx
git commit -m "feat: add Services section with icon cards from API"
```

---

### Task 12: CatalogPreview + ProductCard

**Files:**
- Create: `frontend/src/components/ProductCard.tsx`
- Create: `frontend/src/components/CatalogPreview.tsx`

- [ ] **Step 1: Create ProductCard**

Create `frontend/src/components/ProductCard.tsx`:
```typescript
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Package } from "lucide-react";
import type { Product } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <motion.div
      className="bg-turbo-card rounded-xl overflow-hidden border border-white/5 cursor-pointer"
      whileHover={{ scale: 1.03, borderColor: "#ff6a00" }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <div className="relative h-48 bg-turbo-dark overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-turbo-gray">
            <Package size={48} />
          </div>
        )}
        <span className="absolute top-3 left-3 bg-turbo-orange text-white text-xs font-bold uppercase px-2 py-1 rounded">
          {product.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-sm uppercase tracking-wider mb-1">{product.name}</h3>
        <p className="text-turbo-gray text-xs uppercase tracking-wider">{product.brand}</p>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create CatalogPreview**

Create `frontend/src/components/CatalogPreview.tsx`:
```typescript
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchFeaturedProducts, type Product } from "@/lib/api";
import ProductCard from "./ProductCard";
import ScrollAnimation from "./ScrollAnimation";

export default function CatalogPreview() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchFeaturedProducts().then(setProducts).catch(console.error);
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-turbo-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <h2 className="text-3xl md:text-4xl font-bold text-center uppercase tracking-wider mb-12">
            Produtos em <span className="text-turbo-orange">Destaque</span>
          </h2>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ScrollAnimation key={product.id} delay={index * 0.1}>
              <ProductCard product={product} />
            </ScrollAnimation>
          ))}
        </div>

        <ScrollAnimation delay={0.3}>
          <div className="text-center mt-12">
            <Link
              href="/catalogo"
              className="inline-block bg-turbo-orange hover:bg-turbo-orange-hover text-white font-bold py-3 px-8 rounded-lg uppercase tracking-wider transition-colors"
            >
              Ver Catalogo Completo
            </Link>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ProductCard.tsx frontend/src/components/CatalogPreview.tsx
git commit -m "feat: add ProductCard and CatalogPreview section"
```

---

### Task 13: Sellers section

**Files:**
- Create: `frontend/src/components/Sellers.tsx`

- [ ] **Step 1: Create Sellers component**

Create `frontend/src/components/Sellers.tsx`:
```typescript
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MessageCircle, MapPin, Globe, User } from "lucide-react";
import { fetchSellers, type Seller } from "@/lib/api";
import ScrollAnimation from "./ScrollAnimation";

export default function Sellers() {
  const [sellers, setSellers] = useState<Seller[]>([]);

  useEffect(() => {
    fetchSellers().then(setSellers).catch(console.error);
  }, []);

  return (
    <section id="vendedores" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <h2 className="text-3xl md:text-4xl font-bold text-center uppercase tracking-wider mb-12">
            Nossos <span className="text-turbo-orange">Vendedores</span>
          </h2>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {sellers.map((seller, index) => (
            <ScrollAnimation key={seller.id} delay={index * 0.2}>
              <motion.div
                className="bg-turbo-card rounded-xl p-8 border border-white/5 text-center"
                whileHover={{ scale: 1.03, borderColor: "#ff6a00" }}
                transition={{ duration: 0.2 }}
              >
                {/* Photo */}
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 bg-turbo-dark border-2 border-turbo-orange">
                  {seller.photo_url ? (
                    <Image
                      src={seller.photo_url}
                      alt={seller.name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <User size={48} className="text-turbo-gray" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold uppercase tracking-wider mb-2">{seller.name}</h3>

                {/* Coverage badge */}
                <span className="inline-flex items-center gap-1 bg-turbo-orange/20 text-turbo-orange text-xs font-bold uppercase px-3 py-1 rounded-full mb-4">
                  {seller.coverage === "curitiba" ? (
                    <><MapPin size={14} /> Curitiba</>
                  ) : (
                    <><Globe size={14} /> Brasil</>
                  )}
                </span>

                {/* Description */}
                <p className="text-turbo-gray text-sm leading-relaxed mb-6">{seller.description}</p>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${seller.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
              </motion.div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/Sellers.tsx
git commit -m "feat: add Sellers section with coverage badges and WhatsApp"
```

---

### Task 14: Location section

**Files:**
- Create: `frontend/src/components/Location.tsx`

- [ ] **Step 1: Create Location component**

Create `frontend/src/components/Location.tsx`:
```typescript
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Satellite, Eye, MapPin, Clock, Phone } from "lucide-react";
import ScrollAnimation from "./ScrollAnimation";

const MAP_QUERY = "Rua+Bom+Jesus+de+Iguape+948+Curitiba+PR";

const VIEWS = [
  {
    key: "map",
    label: "Mapa",
    icon: Map,
    src: `https://maps.google.com/maps?q=${MAP_QUERY}&t=m&z=17&ie=UTF8&iwloc=&output=embed`,
  },
  {
    key: "satellite",
    label: "Satelite",
    icon: Satellite,
    src: `https://maps.google.com/maps?q=${MAP_QUERY}&t=k&z=18&ie=UTF8&iwloc=&output=embed`,
  },
  {
    key: "street",
    label: "Street View",
    icon: Eye,
    src: `https://www.google.com/maps/embed?pb=!4v1710000000000!6m8!1m7!1s${MAP_QUERY}!2m2!1d-25.45!2d-49.25!3f0!4f0!5f0.7820865974627469`,
  },
];

export default function Location() {
  const [activeView, setActiveView] = useState(0);

  return (
    <section id="localizacao" className="py-24 bg-turbo-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <h2 className="text-3xl md:text-4xl font-bold text-center uppercase tracking-wider mb-12">
            <span className="text-turbo-orange">Localizacao</span>
          </h2>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          {/* View tabs */}
          <div className="flex justify-center gap-2 mb-6">
            {VIEWS.map((view, index) => {
              const Icon = view.icon;
              const isActive = activeView === index;
              return (
                <button
                  key={view.key}
                  onClick={() => setActiveView(index)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-turbo-orange text-white shadow-lg shadow-turbo-orange/30"
                      : "bg-white/5 text-turbo-gray hover:bg-white/10"
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{view.label}</span>
                </button>
              );
            })}
          </div>

          {/* Map iframe */}
          <div className="rounded-xl overflow-hidden border border-white/10">
            <AnimatePresence mode="wait">
              <motion.iframe
                key={VIEWS[activeView].key}
                src={VIEWS[activeView].src}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </div>
        </ScrollAnimation>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <ScrollAnimation delay={0.3}>
            <div className="bg-turbo-card rounded-xl p-6 border border-white/5 flex items-start gap-4">
              <MapPin className="text-turbo-orange flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Endereco</h4>
                <p className="text-turbo-gray text-sm">Rua Bom Jesus de Iguape, 948</p>
                <p className="text-turbo-gray text-sm">Curitiba/PR</p>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={0.4}>
            <div className="bg-turbo-card rounded-xl p-6 border border-white/5 flex items-start gap-4">
              <Clock className="text-turbo-orange flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Horario</h4>
                <p className="text-turbo-gray text-sm">Segunda a Sexta</p>
                <p className="text-turbo-gray text-sm">08:00 - 12:00 | 13:15 - 18:00</p>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={0.5}>
            <div className="bg-turbo-card rounded-xl p-6 border border-white/5 flex items-start gap-4">
              <Phone className="text-turbo-orange flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Telefone</h4>
                <p className="text-turbo-gray text-sm">(41) 3095-9150</p>
                <p className="text-turbo-gray text-sm">WhatsApp</p>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/Location.tsx
git commit -m "feat: add Location section with Google Maps 3-tab embed"
```

---

### Task 15: Assemble Home page

**Files:**
- Modify: `frontend/src/app/page.tsx`

- [ ] **Step 1: Replace Home page**

Replace `frontend/src/app/page.tsx`:
```typescript
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import CatalogPreview from "@/components/CatalogPreview";
import Sellers from "@/components/Sellers";
import Location from "@/components/Location";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <CatalogPreview />
      <Sellers />
      <Location />
    </>
  );
}
```

- [ ] **Step 2: Test home page loads**

Start backend and frontend:
```bash
# Terminal 1
cd C:/Users/Usuario/Documents/turbo-ex-site/backend
python -m uvicorn main:app --port 8000 --reload

# Terminal 2
cd C:/Users/Usuario/Documents/turbo-ex-site/frontend
npm run dev
```

Open `http://turboexTeste:3000` (add `127.0.0.1 turboexTeste` to hosts file) and verify all sections render.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/page.tsx
git commit -m "feat: assemble Home page with all sections"
```

---

## Chunk 4: Catalog Page + Docker

### Task 16: FilterBar + ProductModal

**Files:**
- Create: `frontend/src/components/FilterBar.tsx`
- Create: `frontend/src/components/ProductModal.tsx`

- [ ] **Step 1: Create FilterBar**

Create `frontend/src/components/FilterBar.tsx`:
```typescript
"use client";

interface FilterBarProps {
  category: string;
  brand: string;
  application: string;
  onCategoryChange: (v: string) => void;
  onBrandChange: (v: string) => void;
  onApplicationChange: (v: string) => void;
  onClear: () => void;
}

const CATEGORIES = [
  { value: "", label: "Todas Categorias" },
  { value: "nova", label: "Nova" },
  { value: "recondicionada", label: "Recondicionada" },
];

const BRANDS = [
  { value: "", label: "Todas Marcas" },
  { value: "garrett", label: "Garrett" },
  { value: "borgwarner", label: "BorgWarner" },
  { value: "holset", label: "Holset" },
  { value: "masterpower", label: "MasterPower" },
  { value: "turbonetics", label: "Turbonetics" },
];

const APPLICATIONS = [
  { value: "", label: "Todas Aplicacoes" },
  { value: "caminhao", label: "Caminhao" },
  { value: "carro", label: "Carro" },
  { value: "agricola", label: "Agricola" },
  { value: "industrial", label: "Industrial" },
];

export default function FilterBar({
  category, brand, application,
  onCategoryChange, onBrandChange, onApplicationChange, onClear,
}: FilterBarProps) {
  const hasFilters = category || brand || application;

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="bg-turbo-card border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-turbo-orange focus:outline-none flex-1"
      >
        {CATEGORIES.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select
        value={brand}
        onChange={(e) => onBrandChange(e.target.value)}
        className="bg-turbo-card border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-turbo-orange focus:outline-none flex-1"
      >
        {BRANDS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select
        value={application}
        onChange={(e) => onApplicationChange(e.target.value)}
        className="bg-turbo-card border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-turbo-orange focus:outline-none flex-1"
      >
        {APPLICATIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={onClear}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg text-sm transition-colors"
        >
          Limpar
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create ProductModal**

Create `frontend/src/components/ProductModal.tsx`:
```typescript
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { X, MessageCircle, Package } from "lucide-react";
import type { Product } from "@/lib/api";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const message = product.whatsapp_message
    || `Ola, tenho interesse na turbina ${product.name}. Gostaria de um orcamento.`;
  const whatsappUrl = `https://wa.me/554130959150?text=${encodeURIComponent(message)}`;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <motion.div
        className="relative bg-turbo-card rounded-xl max-w-lg w-full overflow-hidden border border-white/10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-turbo-gray hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Image */}
        <div className="relative h-64 bg-turbo-dark">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-turbo-gray">
              <Package size={64} />
            </div>
          )}
          <span className="absolute top-3 left-3 bg-turbo-orange text-white text-xs font-bold uppercase px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold uppercase tracking-wider mb-1">{product.name}</h3>
          <p className="text-turbo-orange text-sm uppercase tracking-wider mb-4">{product.brand}</p>
          <p className="text-turbo-gray text-sm leading-relaxed mb-2">
            <span className="text-white font-bold">Aplicacao:</span> {product.application}
          </p>
          {product.description && (
            <p className="text-turbo-gray text-sm leading-relaxed mb-6">{product.description}</p>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors"
          >
            <MessageCircle size={20} />
            Pedir Orcamento
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/FilterBar.tsx frontend/src/components/ProductModal.tsx
git commit -m "feat: add FilterBar and ProductModal components"
```

---

### Task 17: Catalog page

**Files:**
- Create: `frontend/src/app/catalogo/page.tsx`

- [ ] **Step 1: Create catalog page**

Create `frontend/src/app/catalogo/page.tsx`:
```typescript
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchProducts, type Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import FilterBar from "@/components/FilterBar";

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [application, setApplication] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchProducts({
      category: category || undefined,
      brand: brand || undefined,
      application: application || undefined,
    })
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, brand, application]);

  const clearFilters = () => {
    setCategory("");
    setBrand("");
    setApplication("");
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-8">
          <span className="text-turbo-orange">Catalogo</span> de Turbinas
        </h1>

        <FilterBar
          category={category}
          brand={brand}
          application={application}
          onCategoryChange={setCategory}
          onBrandChange={setBrand}
          onApplicationChange={setApplication}
          onClear={clearFilters}
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-turbo-card rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-turbo-gray text-lg mb-4">Nenhum produto encontrado.</p>
            <button
              onClick={clearFilters}
              className="bg-turbo-orange hover:bg-turbo-orange-hover text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <ProductCard product={product} onClick={() => setSelectedProduct(product)} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Add catalog page metadata**

Create `frontend/src/app/catalogo/layout.tsx`:
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalogo de Turbinas | TurboEX",
  description: "Catalogo completo de turbinas novas e recondicionadas. Garrett, BorgWarner, Holset, MasterPower e mais.",
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

- [ ] **Step 3: Test catalog page**

Open `http://turboexTeste:3000/catalogo` — should show FilterBar + empty state (no products seeded yet).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/catalogo/
git commit -m "feat: add Catalog page with filters, stagger grid, modal"
```

---

### Task 18: Frontend Dockerfile + Docker Compose

**Files:**
- Create: `frontend/Dockerfile`
- Create: `docker-compose.yml`

- [ ] **Step 1: Create frontend Dockerfile**

Create `frontend/Dockerfile`:
```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG BACKEND_URL=http://backend:8000
ENV BACKEND_URL=$BACKEND_URL
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

- [ ] **Step 2: Create docker-compose.yml**

Create `docker-compose.yml`:
```yaml
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/data:/app/data

  frontend:
    build:
      context: ./frontend
      args:
        BACKEND_URL: http://backend:8000
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

- [ ] **Step 3: Test Docker Compose builds**

```bash
cd C:/Users/Usuario/Documents/turbo-ex-site
docker-compose build
docker-compose up
```

Open `http://turboexTeste:3000` and verify site works in Docker.

- [ ] **Step 4: Commit**

```bash
git add frontend/Dockerfile docker-compose.yml
git commit -m "feat: add Docker setup (frontend + backend + compose)"
```

---

### Task 19: Configure custom hostname

- [ ] **Step 1: Add turboexTeste to hosts file**

Add entry to `C:\Windows\System32\drivers\etc\hosts` (requires admin):
```
127.0.0.1 turboexTeste
```

- [ ] **Step 2: Update CORS to allow turboexTeste**

In `backend/main.py`, update CORS origins:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://turboexTeste:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

- [ ] **Step 3: Update next.config.ts image patterns**

Add turboexTeste to `remotePatterns` in `frontend/next.config.ts`:
```typescript
images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/uploads/**" },
      { protocol: "http", hostname: "localhost", port: "3000", pathname: "/uploads/**" },
      { protocol: "http", hostname: "turboexTeste", port: "8000", pathname: "/uploads/**" },
      { protocol: "http", hostname: "turboexTeste", port: "3000", pathname: "/uploads/**" },
    ],
},
```

- [ ] **Step 4: Verify access via turboexTeste**

Open `http://turboexTeste:3000` in the browser and confirm the site loads.

- [ ] **Step 5: Commit**

```bash
git add backend/main.py frontend/next.config.ts
git commit -m "feat: add turboexTeste hostname support"
```

---

### Task 20: Final verification

- [ ] **Step 1: Verify all endpoints**

```bash
curl http://localhost:8000/api/health
curl http://localhost:8000/api/services
curl http://localhost:8000/api/sellers
curl http://localhost:8000/api/products
curl http://localhost:8000/api/products/featured
```

- [ ] **Step 2: Verify all frontend pages**

- `http://turboexTeste:3000` — Home with all 6 sections
- `http://turboexTeste:3000/catalogo` — Catalog with filters
- Navbar links scroll to sections
- WhatsApp button visible and links correct
- Mobile hamburger menu works (resize browser)

- [ ] **Step 3: Verify Docker Compose**

```bash
docker-compose down
docker-compose up --build
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final verification pass"
```
