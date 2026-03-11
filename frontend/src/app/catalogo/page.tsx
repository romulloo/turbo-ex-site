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
