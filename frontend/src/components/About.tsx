import Image from "next/image";
import ScrollAnimation from "./ScrollAnimation";

export default function About() {
  return (
    <section id="sobre" className="py-24 bg-turbo-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <h2 className="text-3xl md:text-4xl font-bold text-center uppercase tracking-wider mb-12">
            Sobre a <span className="text-turbo-orange">TurboEX</span>
          </h2>
        </ScrollAnimation>

        {/* Team photo */}
        <ScrollAnimation delay={0.1}>
          <div className="rounded-xl overflow-hidden border border-white/10 mb-12">
            <Image
              src="/images/equipe.webp"
              alt="Equipe TurboEX em frente a empresa"
              width={1200}
              height={500}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <ScrollAnimation delay={0.2}>
            <p className="text-turbo-gray text-lg leading-relaxed">
              Atuamos no mercado reparador de Turbos desde 2012. Em 2020 inauguramos
              nossa Oficina Mecanica, realizando manutencoes basicas e upgrades em
              automoveis nacionais e importados.
            </p>
            <p className="text-turbo-gray text-lg leading-relaxed mt-4">
              Utilizamos dinamometro <span className="text-white font-semibold">Servitec</span>.
              Somos representantes da <span className="text-turbo-orange font-semibold">VagcodingBr</span>,
              entregando as melhores solucoes aos nossos clientes.
            </p>
          </ScrollAnimation>

          <ScrollAnimation delay={0.4}>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "1000+", label: "Turbinas Vendidas" },
                { value: "500+", label: "Clientes Satisfeitos" },
                { value: "14+", label: "Anos de Experiencia" },
                { value: "100%", label: "Garantia" },
              ].map((stat) => (
                <div key={stat.label} className="bg-turbo-card rounded-xl p-6 text-center border border-white/5">
                  <p className="text-3xl font-bold text-turbo-orange">{stat.value}</p>
                  <p className="text-turbo-gray text-sm mt-2 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
