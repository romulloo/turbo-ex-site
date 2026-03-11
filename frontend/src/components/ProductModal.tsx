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
