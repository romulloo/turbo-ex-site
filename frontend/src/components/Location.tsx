"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Satellite, Eye, MapPin, Clock, Phone } from "lucide-react";
import ScrollAnimation from "./ScrollAnimation";

const MAP_QUERY = "Rua+Bom+Jesus+de+Iguape+948+Curitiba+PR";

const VIEWS = [
  {
    key: "map",
    label: "Mapa",
    icon: Map,
    src: `https://maps.google.com/maps?q=${MAP_QUERY}&t=m&z=17&ie=UTF8&iwloc=&output=embed`,
  },
  {
    key: "satellite",
    label: "Satelite",
    icon: Satellite,
    src: `https://maps.google.com/maps?q=${MAP_QUERY}&t=k&z=18&ie=UTF8&iwloc=&output=embed`,
  },
  {
    key: "street",
    label: "Street View",
    icon: Eye,
    src: `https://www.google.com/maps/embed?pb=!4v1710000000000!6m8!1m7!1s${MAP_QUERY}!2m2!1d-25.45!2d-49.25!3f0!4f0!5f0.7820865974627469`,
  },
];

export default function Location() {
  const [activeView, setActiveView] = useState(0);

  return (
    <section id="localizacao" className="py-24 bg-turbo-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <h2 className="text-3xl md:text-4xl font-bold text-center uppercase tracking-wider mb-12">
            <span className="text-turbo-orange">Localizacao</span>
          </h2>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          {/* View tabs */}
          <div className="flex justify-center gap-2 mb-6">
            {VIEWS.map((view, index) => {
              const Icon = view.icon;
              const isActive = activeView === index;
              return (
                <button
                  key={view.key}
                  onClick={() => setActiveView(index)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-turbo-orange text-white shadow-lg shadow-turbo-orange/30"
                      : "bg-white/5 text-turbo-gray hover:bg-white/10"
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{view.label}</span>
                </button>
              );
            })}
          </div>

          {/* Map iframe */}
          <div className="rounded-xl overflow-hidden border border-white/10">
            <AnimatePresence mode="wait">
              <motion.iframe
                key={VIEWS[activeView].key}
                src={VIEWS[activeView].src}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </div>
        </ScrollAnimation>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <ScrollAnimation delay={0.3}>
            <div className="bg-turbo-card rounded-xl p-6 border border-white/5 flex items-start gap-4">
              <MapPin className="text-turbo-orange flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Endereco</h4>
                <p className="text-turbo-gray text-sm">Rua Bom Jesus de Iguape, 948</p>
                <p className="text-turbo-gray text-sm">Curitiba/PR</p>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={0.4}>
            <div className="bg-turbo-card rounded-xl p-6 border border-white/5 flex items-start gap-4">
              <Clock className="text-turbo-orange flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Horario</h4>
                <p className="text-turbo-gray text-sm">Segunda a Sexta</p>
                <p className="text-turbo-gray text-sm">08:00 - 12:00 | 13:15 - 18:00</p>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={0.5}>
            <div className="bg-turbo-card rounded-xl p-6 border border-white/5 flex items-start gap-4">
              <Phone className="text-turbo-orange flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Telefone</h4>
                <p className="text-turbo-gray text-sm">(41) 3095-9150</p>
                <p className="text-turbo-gray text-sm">WhatsApp</p>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
