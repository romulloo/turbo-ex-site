"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MessageCircle, MapPin, Globe, User } from "lucide-react";
import { fetchSellers, type Seller } from "@/lib/api";
import ScrollAnimation from "./ScrollAnimation";

export default function Sellers() {
  const [sellers, setSellers] = useState<Seller[]>([]);

  useEffect(() => {
    fetchSellers().then(setSellers).catch(console.error);
  }, []);

  return (
    <section id="vendedores" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <h2 className="text-3xl md:text-4xl font-bold text-center uppercase tracking-wider mb-12">
            Nossos <span className="text-turbo-orange">Vendedores</span>
          </h2>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {sellers.map((seller, index) => (
            <ScrollAnimation key={seller.id} delay={index * 0.2}>
              <motion.div
                className="bg-turbo-card rounded-xl p-8 border border-white/5 text-center"
                whileHover={{ scale: 1.03, borderColor: "#ff6a00" }}
                transition={{ duration: 0.2 }}
              >
                {/* Photo */}
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 bg-turbo-dark border-2 border-turbo-orange">
                  {seller.photo_url ? (
                    <Image
                      src={seller.photo_url}
                      alt={seller.name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <User size={48} className="text-turbo-gray" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold uppercase tracking-wider mb-2">{seller.name}</h3>

                {/* Coverage badge */}
                <span className="inline-flex items-center gap-1 bg-turbo-orange/20 text-turbo-orange text-xs font-bold uppercase px-3 py-1 rounded-full mb-4">
                  {seller.coverage === "curitiba" ? (
                    <><MapPin size={14} /> Curitiba</>
                  ) : (
                    <><Globe size={14} /> Brasil</>
                  )}
                </span>

                {/* Description */}
                <p className="text-turbo-gray text-sm leading-relaxed mb-6">{seller.description}</p>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${seller.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
              </motion.div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
