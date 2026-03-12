"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { fetchFeaturedProducts, type Product } from "@/lib/api";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import ScrollAnimation from "./ScrollAnimation";

export default function CatalogPreview() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchFeaturedProducts().then(setProducts).catch(console.error);
  }, []);

  if (products.length === 0) return null;

  // Triplicate for seamless infinite scroll
  const allProducts = [...products, ...products, ...products];

  return (
    <section className="py-24 bg-turbo-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <h2 className="text-3xl md:text-4xl font-bold text-center uppercase tracking-wider mb-12">
            Produtos em <span className="text-turbo-orange">Destaque</span>
          </h2>
        </ScrollAnimation>
      </div>

      {/* Marquee container - full width */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-turbo-dark to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-turbo-dark to-transparent z-10 pointer-events-none" />

        <div
          className="animate-marquee flex gap-6 px-4"
          style={{ "--marquee-duration": "25s", width: "max-content" } as React.CSSProperties}
        >
          {allProducts.map((product, index) => (
            <div key={`${product.id}-${index}`} className="w-72 flex-shrink-0">
              <ProductCard
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            </div>
          ))}
        </div>
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

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
