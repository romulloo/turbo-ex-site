# TurboEX - Site Institucional

Site institucional interativo para a **TurboEX**, empresa de turbinas automotivas em Curitiba/PR.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 15 + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion |
| Backend | Python 3.12 + FastAPI + SQLAlchemy + SQLite |
| Deploy | Docker Compose |

## Como Rodar

### Com Docker (recomendado)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000

### Sem Docker (desenvolvimento)

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --port 8000 --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Estrutura do Projeto

```
turbo-ex-site/
├── frontend/                # Next.js app
│   ├── src/
│   │   ├── app/             # Pages (Home + Catalogo)
│   │   ├── components/      # 14 componentes React
│   │   └── lib/api.ts       # Cliente API
│   ├── Dockerfile
│   └── next.config.ts       # Proxy /api/* -> backend
├── backend/                 # FastAPI app
│   ├── main.py              # App principal
│   ├── models.py            # Product, Seller, Service
│   ├── routers/             # Endpoints API
│   ├── seed.py              # Dados iniciais
│   ├── uploads/             # Fotos (products/ + sellers/)
│   └── Dockerfile
├── docker-compose.yml
└── docs/                    # Specs e planos
```

## Paginas

| Pagina | Rota | Descricao |
|--------|------|-----------|
| Home | `/` | Hero + Sobre + Servicos + Catalogo Preview + Vendedores + Localizacao |
| Catalogo | `/catalogo` | Filtros (categoria/marca/aplicacao) + grid de produtos + modal orcamento |

## API Endpoints

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/products` | Lista produtos (filtros: `?category=`, `?brand=`, `?application=`) |
| GET | `/api/products/featured` | Produtos em destaque |
| GET | `/api/products/{id}` | Detalhe de um produto |
| GET | `/api/sellers` | Lista vendedores |
| GET | `/api/services` | Lista servicos |
| GET | `/api/health` | Health check |

## Design

- **Cores**: Preto (#0a0a0a) + Laranja (#ff6a00) + Branco
- **Animacoes**: Scroll animations, parallax no hero, hover effects nos cards
- **Responsivo**: Mobile-first, hamburger menu, grid adaptativo
- **WhatsApp**: Botao flutuante + botao individual por vendedor + orcamento por produto

## Dados

O backend faz seed automatico na primeira execucao:
- 5 servicos (Venda, Recondicionamento, Manutencao, Balanceamento, Reparo)
- 2 vendedores placeholder

Para adicionar produtos ao catalogo, use o script ou acesse o banco SQLite diretamente:
```bash
cd backend
python -c "
from database import SessionLocal
from models import Product
db = SessionLocal()
db.add(Product(
    name='Turbina Garrett GT2860',
    brand='garrett',
    category='nova',
    application='carro',
    description='Turbina de alta performance para carros esportivos',
    is_featured=True
))
db.commit()
"
```

## Informacoes da Empresa

- **Endereco**: Rua Bom Jesus de Iguape, 948 - Curitiba/PR
- **WhatsApp**: (41) 3095-9150
- **Horario**: Seg-Sex 08:00-12:00 | 13:15-18:00
- **Instagram**: [@turboexcwb](https://instagram.com/turboexcwb)
- **Facebook**: [@TurboEXCuritiba](https://facebook.com/TurboEXCuritiba)
