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
