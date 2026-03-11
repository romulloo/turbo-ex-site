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
