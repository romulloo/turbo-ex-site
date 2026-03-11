import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalogo de Turbinas | TurboEX",
  description: "Catalogo completo de turbinas novas e recondicionadas. Garrett, BorgWarner, Holset, MasterPower e mais.",
  openGraph: {
    title: "Catalogo de Turbinas | TurboEX",
    description: "Catalogo completo de turbinas novas e recondicionadas em Curitiba/PR.",
  },
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
