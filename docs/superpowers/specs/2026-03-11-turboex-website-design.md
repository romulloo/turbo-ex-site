# TurboEX Website — Design Spec

**Date**: 2026-03-11
**Status**: Approved
**Project**: turbo-ex-site
**Path**: `C:\Users\Usuario\Documents\turbo-ex-site\`

---

## 1. Overview

Website institucional interativo para a **TurboEX**, empresa de turbinas automotivas em Curitiba/PR. O site apresenta a empresa, seus servicos, catalogo de produtos com filtros, vendedores e localizacao.

### Stack
- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion
- **Backend**: Python 3.12 + FastAPI + SQLAlchemy + SQLite
- **Deploy**: Docker Compose (frontend :3000 + backend :8000)

### Informacoes da Empresa
- **Nome**: TurboEX
- **Instagram**: @turboexcwb
- **Facebook**: @TurboEXCuritiba
- **WhatsApp Geral**: (41) 3095-9150
- **Endereco**: Rua Bom Jesus de Iguape 948, Curitiba/PR
- **Horario**: Segunda a Sexta, 08:00-18:00 (almoco 12:00-13:15)

---

## 2. Arquitetura

```
turbo-ex-site/
├── frontend/                # Next.js app
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx            # Home (one-page)
│   │   │   ├── catalogo/
│   │   │   │   └── page.tsx        # Catalogo com filtros
│   │   │   └── layout.tsx          # Root layout
│   │   ├── components/
│   │   │   ├── Navbar.tsx          # Nav fixa com glassmorphism
│   │   │   ├── Hero.tsx            # Hero com parallax
│   │   │   ├── About.tsx           # Secao Sobre
│   │   │   ├── Services.tsx        # Cards de servicos
│   │   │   ├── CatalogPreview.tsx  # Produtos em destaque
│   │   │   ├── Sellers.tsx         # Cards de vendedores
│   │   │   ├── Location.tsx        # Google Maps embed
│   │   │   ├── Footer.tsx          # Footer
│   │   │   ├── WhatsAppButton.tsx  # Botao flutuante
│   │   │   ├── ProductCard.tsx     # Card de produto
│   │   │   ├── ProductModal.tsx    # Modal detalhe produto
│   │   │   ├── FilterBar.tsx       # Barra de filtros catalogo
│   │   │   └── ScrollAnimation.tsx # Wrapper Framer Motion
│   │   └── lib/
│   │       └── api.ts              # Funcoes fetch para a API
│   ├── public/
│   │   └── images/                 # Logo, hero bg, etc.
│   ├── next.config.ts              # Proxy /api/* -> :8000
│   ├── tailwind.config.ts
│   ├── package.json
│   └── Dockerfile
├── backend/
│   ├── main.py                     # App FastAPI + startup
│   ├── models.py                   # SQLAlchemy models
│   ├── schemas.py                  # Pydantic schemas
│   ├── database.py                 # Engine + session
│   ├── seed.py                     # Dados iniciais (servicos, etc.)
│   ├── requirements.txt
│   ├── uploads/
│   │   ├── products/               # Fotos de turbinas
│   │   └── sellers/                # Fotos dos vendedores
│   └── Dockerfile
├── docker-compose.yml              # 2 servicos: frontend + backend
└── README.md
```

- Frontend faz proxy de `/api/*` e `/uploads/*` para o backend na porta 8000
- Backend serve API REST + arquivos estaticos de `/uploads/`
- SQLite com arquivo `turboex.db` em `backend/data/`
- `database.py`: SQLAlchemy com `create_all()` no startup (sem migrations para v1)
- CORSMiddleware habilitado no backend para desenvolvimento local sem Docker

---

## 3. Modelo de Dados

### Product (Turbina)
| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | Integer PK | Auto-increment |
| name | String | Nome da turbina |
| description | Text | Descricao completa |
| brand | String | Marca (garrett, borgwarner, holset, masterpower, etc.) |
| category | String | Estado do produto: "nova", "recondicionada" |
| application | String | Aplicacao (caminhao, carro, agricola, industrial) |
| image_url | String | Caminho da imagem em /uploads/products/ |
| whatsapp_message | String, nullable | Override customizado. Se null, frontend gera: "Ola, tenho interesse na turbina {name}. Gostaria de um orcamento." |
| is_featured | Boolean | Destaque na home (default false) |
| created_at | DateTime | Data de criacao |

### Seller (Vendedor)
| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | Integer PK | Auto-increment |
| name | String | Nome do vendedor |
| description | Text | Descricao / bio |
| photo_url | String | Caminho da foto em /uploads/sellers/ |
| whatsapp | String | Numero WhatsApp formato internacional sem simbolos (ex: "5541999999999") — frontend monta `https://wa.me/{number}` |
| coverage | String | "curitiba" ou "brasil" |

### Service (Servico)
| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | Integer PK | Auto-increment |
| title | String | Titulo do servico |
| description | Text | Descricao do servico |
| icon | String | Nome do icone (lucide-react) |

---

## 4. Endpoints da API

```
GET  /api/products                  # Lista todos (filtros via query params)
     ?category=nova
     ?brand=garrett
     ?application=carro
     # Filtros combinaveis

GET  /api/products/featured         # Produtos em destaque (DECLARAR ANTES de /{id})
GET  /api/products/{id}             # Detalhe de um produto (id: int)

GET  /api/sellers                   # Lista vendedores
GET  /api/services                  # Lista servicos

GET  /api/health                    # Health check
```

- Todos os endpoints sao publicos (sem autenticacao)
- Imagens servidas via `/uploads/products/` e `/uploads/sellers/`
- Filtros combinaveis via query parameters
- Sem paginacao em v1 (catalogo esperado < 100 produtos)
- Erros: HTTPException padrao do FastAPI com `{"detail": "..."}` (ex: 404 "Product not found")
- Opcoes de filtro hardcoded no frontend (categorias: nova, recondicionada / brands e applications conhecidas)

---

## 5. Paginas e Secoes

### 5.1 Home (`/`) — One-page com scroll suave

**Hero**
- Fundo escuro com imagem de turbina em parallax
- Logo TurboEX centralizado
- Slogan da empresa (a ser fornecido pelo usuario)
- Botao CTA "Ver Catalogo" (laranja)
- Efeito parallax nas camadas de fundo

**Sobre**
- Texto sobre a empresa, experiencia, diferenciais
- Animacao fade-in + slide-up ao entrar na viewport

**Servicos**
- Grid de cards com icone + titulo + descricao
- Servicos: Venda de Turbinas Novas, Recondicionamento, Manutencao, Balanceamento, Reparo
- Hover: escala sutil, borda laranja, sombra

**Catalogo Preview**
- 3-4 produtos com `is_featured=true`
- Cards com foto, nome, marca, badge de categoria
- Botao "Ver Catalogo Completo" -> `/catalogo`

**Vendedores**
- 2 cards estilo Coaches do Projeto Futebol
- Foto, nome, descricao, badge de cobertura (Curitiba / Brasil)
- Botao WhatsApp individual em cada card

**Localizacao**
- Google Maps embed com 3 modos (Mapa, Satelite, Street View)
- Endereco: Rua Bom Jesus de Iguape 948, Curitiba/PR
- Horario de funcionamento
- Google Maps embed com `iframe`, tabs para alternar entre Mapa (`roadmap`), Satelite (`satellite`) e Street View (embed API). Mesmo padrao do componente `Location.tsx` do Projeto Futebol

**Footer**
- Links redes sociais (Instagram, Facebook)
- WhatsApp geral
- Horario de funcionamento
- Copyright 2026

### 5.2 Catalogo (`/catalogo`) — Pagina separada

**Barra de Filtros**
- 3 selects combinaveis: Categoria | Marca | Aplicacao
- Filtros aplicados via query params na API

**Grid de Produtos**
- Cards com foto, nome, marca, badge de categoria
- Stagger animation (aparecem um atras do outro)
- Hover: zoom suave na imagem, borda laranja

**Modal de Produto**
- Ao clicar no card: modal com foto maior, descricao completa
- Botao "Pedir Orcamento" abre WhatsApp com mensagem pre-formatada
  - Ex: "Ola, tenho interesse na turbina [nome]. Gostaria de um orcamento."

### 5.3 Navbar (global)
- Fixa no topo
- Logo TurboEX a esquerda
- Links: Inicio, Sobre, Servicos, Catalogo, Vendedores, Localizacao
- Scroll suave para secoes da home. Quando em `/catalogo`, links de secao navegam para `/#secao-id` (full page navigation + scroll)
- Link separado para `/catalogo`
- Mobile: hamburger menu no breakpoint `md:`
- Transparente no topo, glassmorphism (blur) ao scrollar

### 5.4 Botao WhatsApp Flutuante (global)
- Canto inferior direito, sempre visivel
- Direciona pro numero geral (41) 3095-9150
- Pulse animation suave

---

## 6. Design Visual

### Paleta de Cores
| Uso | Cor | Hex |
|-----|-----|-----|
| Fundo principal | Preto | `#0a0a0a` |
| Destaque/CTA | Laranja | `#ff6a00` |
| Texto principal | Branco | `#ffffff` |
| Texto secundario | Cinza claro | `#c0c0c0` |
| Cards/superficies | Cinza escuro | `#1a1a1a` |

### Tipografia
- **Titulos**: Bold, uppercase, tracking-wider (estilo industrial/performance)
- **Corpo**: Inter ou similar, clean e legivel

### Interatividade (Framer Motion)
- **Scroll animations**: fade-in + slide-up nos elementos conforme aparecem na viewport
- **Parallax**: hero e separadores entre secoes
- **Hover nos cards**: escala 1.03, borda laranja, sombra cresce
- **Cards catalogo**: stagger animation (aparecem sequencialmente)
- **Navbar**: transparente -> glassmorphism com blur ao scrollar
- **Botao WhatsApp**: pulse animation
- **Modal**: fade-in com backdrop blur

---

## 7. Docker Compose

```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/data:/app/data
```

- Volume para uploads (fotos persistem entre rebuilds)
- Volume `data/` para banco SQLite + WAL/SHM journals
- Frontend depende do backend
- SQLAlchemy configurado para usar `/app/data/turboex.db`

---

## 8. Seed Data

`seed.py` roda automaticamente no startup se o banco estiver vazio. Popula:

**Servicos** (5 registros):
1. Venda de Turbinas Novas (icon: `package`)
2. Turbinas Recondicionadas (icon: `refresh-cw`)
3. Manutencao (icon: `wrench`)
4. Balanceamento (icon: `gauge`)
5. Reparo (icon: `settings`)

**Vendedores** (2 registros): dados placeholder ate usuario fornecer nomes/fotos reais.

**Produtos**: nao populados via seed — usuario adicionara via script ou futuro admin.

---

## 9. Gestao de Dados (v1)

v1 nao tem painel admin. Dados sao gerenciados via:
- `seed.py` para dados iniciais (servicos, vendedores placeholder)
- Scripts Python avulsos para adicionar/editar produtos no banco
- Acesso direto ao SQLite via CLI se necessario
- Admin panel planejado para v2

---

## 10. Responsivo / Mobile

- Mobile-first com breakpoints Tailwind (`sm:`, `md:`, `lg:`)
- Navbar: hamburger menu em telas < `md:`
- Cards grid: 1 coluna no mobile, 2 em `md:`, 3 em `lg:`
- Parallax desabilitado no mobile (performance)
- Hero: texto e CTA empilhados verticalmente no mobile
- Botao WhatsApp: sempre visivel, mesmo tamanho

---

## 11. SEO e Metadata

- `<title>` e `<meta description>` por pagina (Next.js metadata API)
- Open Graph tags para compartilhamento social
- Imagens com alt text descritivo
- Estrutura semantica (h1, h2, section, nav, footer)
- `robots.txt` e `sitemap.xml` sao nice-to-have para v2

---

## 12. Imagens

- Formatos aceitos: JPG, PNG, WebP
- Next.js `<Image>` com `remotePatterns` configurado para o backend
- Fotos servidas via proxy `/uploads/*` -> backend
- Sem geracao de thumbnails em v1 (imagens carregadas em tamanho adequado)
- Loading: skeleton placeholder nos cards enquanto carrega
- Estado vazio no catalogo: "Nenhum produto encontrado" + botao limpar filtros

---

## 13. Itens Pendentes (usuario vai fornecer)

- [ ] Slogan da empresa (print)
- [ ] Fotos de turbinas do Instagram (prints)
- [ ] Fotos dos 2 vendedores
- [ ] Nomes e descricoes dos vendedores
- [ ] Numeros WhatsApp individuais dos vendedores
- [ ] Logo TurboEX em alta resolucao (se tiver)
- [ ] Texto "Sobre" a empresa (ou eu crio um rascunho)
