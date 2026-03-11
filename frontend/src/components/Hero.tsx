"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";

export default function Hero() {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="inicio" ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax background (disabled on mobile) */}
      <motion.div
        style={{ y: isMobile ? 0 : y }}
        className="absolute inset-0 bg-[url('/images/hero-bg.png')] bg-cover bg-center bg-black"
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 text-center px-4">
        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-wider uppercase mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-turbo-orange">Turbo</span>EX
        </motion.h1>

        <motion.p
          className="text-sm md:text-base text-white/40 mb-8 tracking-[0.25em] uppercase"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Tecnologia em Turbinas
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            href="/catalogo"
            className="inline-block bg-turbo-orange hover:bg-turbo-orange-hover text-white font-bold py-3 px-8 rounded-lg text-lg uppercase tracking-wider transition-colors"
          >
            Ver Catalogo
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
