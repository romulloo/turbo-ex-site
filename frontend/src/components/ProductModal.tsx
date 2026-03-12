"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { X, MessageCircle, Package, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/api";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const images = product.images && product.images.length > 0
    ? product.images
    : product.image_url ? [product.image_url] : [];
  const [currentImage, setCurrentImage] = useState(0);

  const message = product.whatsapp_message
    || `Ola, tenho interesse na turbina ${product.name}. Gostaria de um orcamento.`;
  const whatsappUrl = `https://wa.me/554130959150?text=${encodeURIComponent(message)}`;

  const prevImage = () => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));

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
        className="relative bg-turbo-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
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
        <div className="relative h-96 bg-turbo-dark">
          {images.length > 0 ? (
            <>
              <Image
                src={images[currentImage]}
                alt={`${product.name} - foto ${currentImage + 1}`}
                fill
                className="object-contain"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === currentImage ? "bg-turbo-orange" : "bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-turbo-gray">
              <Package size={64} />
            </div>
          )}
          <span className="absolute top-3 left-3 bg-turbo-orange text-white text-xs font-bold uppercase px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 px-6 pt-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`relative w-12 h-12 rounded-md overflow-hidden border-2 transition-colors ${
                  i === currentImage ? "border-turbo-orange" : "border-white/10 hover:border-white/30"
                }`}
              >
                <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-contain" />
              </button>
            ))}
          </div>
        )}

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
