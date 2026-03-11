"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, RefreshCw, Wrench, Gauge, Settings } from "lucide-react";
import { fetchServices, type Service } from "@/lib/api";
import ScrollAnimation from "./ScrollAnimation";

const ICON_MAP: Record<string, React.ElementType> = {
  package: Package,
  "refresh-cw": RefreshCw,
  wrench: Wrench,
  gauge: Gauge,
  settings: Settings,
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchServices().then(setServices).catch(console.error);
  }, []);

  return (
    <section id="servicos" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <h2 className="text-3xl md:text-4xl font-bold text-center uppercase tracking-wider mb-12">
            Nossos <span className="text-turbo-orange">Servicos</span>
          </h2>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = ICON_MAP[service.icon] || Package;
            return (
              <ScrollAnimation key={service.id} delay={index * 0.1}>
                <motion.div
                  className="bg-turbo-card rounded-xl p-8 border border-white/5 h-full"
                  whileHover={{ scale: 1.03, borderColor: "#ff6a00" }}
                  transition={{ duration: 0.2 }}
                >
                  <IconComponent className="text-turbo-orange mb-4" size={40} />
                  <h3 className="text-lg font-bold uppercase tracking-wider mb-3">{service.title}</h3>
                  <p className="text-turbo-gray text-sm leading-relaxed">{service.description}</p>
                </motion.div>
              </ScrollAnimation>
            );
          })}
        </div>
      </div>
    </section>
  );
}
