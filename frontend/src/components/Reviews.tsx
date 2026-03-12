"use client";

import { Star } from "lucide-react";
import ScrollAnimation from "./ScrollAnimation";

interface Review {
  name: string;
  stars: number;
  text: string;
  date: string;
}

const REVIEWS: Review[] = [
  {
    name: "Marcos S.",
    stars: 5,
    text: "Turbina de qualidade, atendimento excelente. Recomendo muito a TurboEX!",
    date: "2 semanas atras",
  },
  {
    name: "Rafael T.",
    stars: 5,
    text: "Melhor preco de Curitiba e entrega super rapida. Meu caminhao ficou outro.",
    date: "1 mes atras",
  },
  {
    name: "Carlos A.",
    stars: 5,
    text: "Profissionais competentes, fizeram o balanceamento perfeito. Voltarei sempre.",
    date: "3 semanas atras",
  },
  {
    name: "Lucas M.",
    stars: 4,
    text: "Otimo atendimento pelo WhatsApp, tiraram todas as minhas duvidas antes da compra.",
    date: "1 mes atras",
  },
  {
    name: "Anderson P.",
    stars: 5,
    text: "Comprei a IS20 Monster e a diferenca e absurda. Performance de outro nivel!",
    date: "2 meses atras",
  },
  {
    name: "Fernando L.",
    stars: 5,
    text: "Servico de reparo impecavel. Turbina voltou funcionando como nova.",
    date: "1 mes atras",
  },
  {
    name: "Diego R.",
    stars: 4,
    text: "Produto de qualidade e garantia de verdade. Empresa seria e confiavel.",
    date: "3 meses atras",
  },
  {
    name: "Ricardo N.",
    stars: 5,
    text: "Ja comprei 3 turbinas aqui pra frota. Preco justo e nunca tive problema.",
    date: "2 semanas atras",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={i < count ? "text-yellow-400 fill-yellow-400" : "text-white/20"}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex-shrink-0 w-72 bg-turbo-card rounded-xl p-5 border border-white/5">
      <StarRating count={review.stars} />
      <p className="text-turbo-gray text-sm mt-3 mb-4 leading-relaxed">
        &ldquo;{review.text}&rdquo;
      </p>
      <div className="flex items-center justify-between">
        <span className="text-white text-sm font-bold">{review.name}</span>
        <span className="text-white/40 text-xs">{review.date}</span>
      </div>
    </div>
  );
}

export default function Reviews() {
  // Triplicate for seamless infinite scroll
  const allReviews = [...REVIEWS, ...REVIEWS, ...REVIEWS];

  return (
    <section className="py-24 bg-turbo-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < 5 ? "text-yellow-400 fill-yellow-400" : "text-white/20"}
                  />
                ))}
              </div>
              <span className="text-white font-bold text-lg">4.8</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">
              O Que Nossos <span className="text-turbo-orange">Clientes Dizem</span>
            </h2>
          </div>
        </ScrollAnimation>
      </div>

      {/* Marquee container - full width */}
      <div className="relative mt-12">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-turbo-dark to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-turbo-dark to-transparent z-10 pointer-events-none" />

        <div
          className="animate-marquee flex gap-6"
          style={{ "--marquee-duration": "40s", width: "max-content" } as React.CSSProperties}
        >
          {allReviews.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
