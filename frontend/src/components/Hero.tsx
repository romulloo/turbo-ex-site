"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const stats = [
  { value: 1000, suffix: "+", label: "Turbinas Vendidas" },
  { value: 500, suffix: "+", label: "Clientes Atendidos" },
  { value: 10, suffix: "+", label: "Anos de Experiencia" },
  { value: 100, suffix: "%", label: "Garantia" },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
      {count}{suffix}
    </div>
  );
}

function StatsBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const moveGlow = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current || !glowRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    glowRef.current.style.transform = `translate(${x}px, ${y}px)`;
    glowRef.current.style.opacity = "1";
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    moveGlow(e.clientX, e.clientY);
  }, [moveGlow]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    moveGlow(touch.clientX, touch.clientY);
  }, [moveGlow]);

  const hideGlow = useCallback(() => {
    if (!glowRef.current) return;
    glowRef.current.style.opacity = "0";
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={hideGlow}
      onTouchMove={handleTouchMove}
      onTouchEnd={hideGlow}
      className="relative w-full border-t border-white/10 bg-turbo-dark overflow-hidden"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-0"
        style={{
          background: "radial-gradient(circle, rgba(255,106,0,0.15) 0%, rgba(255,106,0,0.05) 40%, transparent 70%)",
          transition: "opacity 0.4s ease-out",
          willChange: "transform",
        }}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
              className="py-8 text-center"
            >
              <CountUp target={stat.value} suffix={stat.suffix} />
              <div className="mt-1 text-xs sm:text-sm text-turbo-gray uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col justify-center bg-turbo-dark"
    >
      <div className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-5xl mx-auto px-6 pt-28 pb-16 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-turbo-orange/30 bg-turbo-orange/10 text-turbo-orange text-xs font-semibold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-turbo-orange animate-pulse" />
            TurboEX CWB
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight"
        >
          <span className="text-turbo-orange">TURBO</span>
          <span className="text-white">EX</span>
          <br />
          <span className="text-white">TECNOLOGIA EM</span>
          <br />
          <span className="text-turbo-gray">TURBINAS</span>
        </motion.h1>

        {/* Slogan - small with blur */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-sm sm:text-base text-white/30 max-w-xl mx-auto leading-relaxed uppercase tracking-[0.3em]"
          style={{ filter: "blur(0.5px)" }}
        >
          Tecnologia em Turbinas
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/catalogo"
            className="btn-shine inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-turbo-orange rounded-full hover:bg-turbo-orange-hover transition-all duration-300 shadow-lg shadow-turbo-orange/30 hover:shadow-turbo-orange/50 hover:scale-105 active:scale-95"
          >
            Ver Catalogo
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="#vendedores"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border border-white/20 rounded-full hover:bg-white/5 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Fale com Vendedor
          </Link>
        </motion.div>
      </div>

      {/* Stats */}
      <StatsBar />
    </section>
  );
}
