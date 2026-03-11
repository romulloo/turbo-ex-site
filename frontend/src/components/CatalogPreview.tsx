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
