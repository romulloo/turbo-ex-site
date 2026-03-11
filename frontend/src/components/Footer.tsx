import { Instagram, Facebook, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold tracking-wider uppercase mb-4">
              <span className="text-turbo-orange">Turbo</span>EX
            </h3>
            <p className="text-turbo-gray text-sm">
              Especialistas em turbinas automotivas em Curitiba/PR.
            </p>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Horario</h4>
            <p className="text-turbo-gray text-sm">Segunda a Sexta</p>
            <p className="text-turbo-gray text-sm">08:00 - 12:00 | 13:15 - 18:00</p>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Redes Sociais</h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/turboexcwb/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-turbo-gray hover:text-turbo-orange transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://www.facebook.com/TurboEXCuritiba"
                target="_blank"
                rel="noopener noreferrer"
                className="text-turbo-gray hover:text-turbo-orange transition-colors"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://wa.me/554130959150"
                target="_blank"
                rel="noopener noreferrer"
                className="text-turbo-gray hover:text-turbo-orange transition-colors"
              >
                <Phone size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-turbo-gray text-sm">
          &copy; {new Date().getFullYear()} TurboEX. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
