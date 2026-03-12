"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Servicos", href: "/#servicos" },
  { label: "Catalogo", href: "/catalogo" },
  { label: "Vendedores", href: "/#vendedores" },
  { label: "Localizacao", href: "/#localizacao" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setMobileOpen(false);
    if (pathname !== "/" && href.startsWith("/#")) {
      window.location.href = href;
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold tracking-wider uppercase flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <path d="M32 4C16 4 8 20 8 32c0 14 10 24 24 28h2c6-1 12-4 16-10 3-5 4-11 2-17-1-4-4-8-7-10" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
              <path d="M32 16c-8 0-14 6-14 14s6 14 14 14 14-6 14-14-6-14-14-14z" stroke="white" strokeWidth="2.5" fill="none"/>
              <path d="M32 22c-4.5 0-8 3.5-8 8s3.5 8 8 8 8-3.5 8-8-3.5-8-8-8z" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M30 30l6-4M30 30l4 6M30 30l-6 2M30 30l-2-6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span><span className="text-turbo-orange">Turbo</span>EX</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="text-sm uppercase tracking-wider text-turbo-gray hover:text-turbo-orange transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-md pb-4"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="block py-3 px-4 text-sm uppercase tracking-wider text-turbo-gray hover:text-turbo-orange transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
