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

// Fallback data for static deployment (no backend)
const FALLBACK_SERVICES: Service[] = [
  { id: 1, title: "Venda de Turbinas Novas", description: "Turbinas originais e de alta performance para todos os tipos de veiculos.", icon: "package" },
  { id: 2, title: "Turbinas Recondicionadas", description: "Turbinas recondicionadas com garantia e qualidade assegurada.", icon: "refresh-cw" },
  { id: 3, title: "Manutencao", description: "Manutencao preventiva e corretiva para prolongar a vida util da sua turbina.", icon: "wrench" },
  { id: 4, title: "Balanceamento", description: "Balanceamento de precisao para maximo desempenho e durabilidade.", icon: "gauge" },
  { id: 5, title: "Reparo", description: "Reparo completo com pecas originais e mao de obra especializada.", icon: "settings" },
];

const FALLBACK_SELLERS: Seller[] = [
  { id: 1, name: "Vendedor Curitiba", description: "Atendimento especializado para a regiao de Curitiba e regiao metropolitana.", photo_url: null, whatsapp: "5541999999999", coverage: "curitiba" },
  { id: 2, name: "Vendedor Brasil", description: "Atendimento para todo o territorio nacional com envio para todo o Brasil.", photo_url: null, whatsapp: "5541888888888", coverage: "brasil" },
];

const FALLBACK_PRODUCTS: Product[] = [
  { id: 1, name: "Turbina TurboEX TEX-4849", description: "Turbina de alta performance TurboEX modelo TEX-4849. Pronta entrega com garantia. Ideal para veiculos de passeio e utilitarios.", brand: "TurboEX", category: "Pronta Entrega", application: "carro", image_url: "/images/turbina-exemplo.png", whatsapp_message: null, is_featured: true, created_at: "2026-03-11T00:00:00" },
  { id: 2, name: "Turbina TurboEX TEX-5055", description: "Turbina TurboEX modelo TEX-5055 para caminhoes e veiculos pesados. Pronta entrega com garantia e assistencia tecnica.", brand: "TurboEX", category: "Pronta Entrega", application: "caminhao", image_url: "/images/turbina-exemplo.png", whatsapp_message: null, is_featured: true, created_at: "2026-03-11T00:00:00" },
  { id: 3, name: "Turbina TurboEX TEX-3540", description: "Turbina TurboEX modelo TEX-3540 com pecas originais. Pronta entrega com garantia de fabrica.", brand: "TurboEX", category: "Pronta Entrega", application: "carro", image_url: "/images/turbina-exemplo.png", whatsapp_message: null, is_featured: true, created_at: "2026-03-11T00:00:00" },
  { id: 4, name: "Turbina TurboEX TEX-6065", description: "Turbina TurboEX modelo TEX-6065 de alta performance. Pronta entrega com garantia.", brand: "TurboEX", category: "Pronta Entrega", application: "caminhao", image_url: "/images/turbina-exemplo.png", whatsapp_message: null, is_featured: false, created_at: "2026-03-11T00:00:00" },
];

const API_BASE = "/api";

async function fetchWithFallback<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("API error");
    return res.json();
  } catch {
    return fallback;
  }
}

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
  try {
    const res = await fetch(`${API_BASE}/products${query}`);
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    let products = FALLBACK_PRODUCTS;
    if (filters?.application) products = products.filter(p => p.application === filters.application);
    return products;
  }
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  return fetchWithFallback(`${API_BASE}/products/featured`, FALLBACK_PRODUCTS.filter(p => p.is_featured));
}

export async function fetchProduct(id: number): Promise<Product> {
  return fetchWithFallback(`${API_BASE}/products/${id}`, FALLBACK_PRODUCTS.find(p => p.id === id) || FALLBACK_PRODUCTS[0]);
}

export async function fetchSellers(): Promise<Seller[]> {
  return fetchWithFallback(`${API_BASE}/sellers`, FALLBACK_SELLERS);
}

export async function fetchServices(): Promise<Service[]> {
  return fetchWithFallback(`${API_BASE}/services`, FALLBACK_SERVICES);
}
