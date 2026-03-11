import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TurboEX - Especialistas em Turbinas | Curitiba/PR",
  description:
    "Venda, manutencao, balanceamento e reparo de turbinas automotivas em Curitiba. Turbinas novas e recondicionadas com garantia.",
  openGraph: {
    title: "TurboEX - Especialistas em Turbinas",
    description: "Venda, manutencao e reparo de turbinas automotivas em Curitiba/PR.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-turbo-dark text-white`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
