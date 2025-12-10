import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#000000] text-white relative overflow-hidden">
      {/* ✈️ LÍNEA NARANJA ANIMADA (estela de avión) */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#ff6b00] to-transparent animate-movingGlow" />

      {/* CONTENIDO PRINCIPAL */}
      <div className="py-12 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-700 pb-10">
        {/* LOGO */}
        <div>
          <img
            src="/images/logoSkyAndes.png"
            alt="SkyAndes Logo"
            className="h-12 mb-4"
          />
          <p className="text-gray-400 text-sm leading-relaxed">
            SkyAndes Airlines, conectando Ecuador con el mundo desde Miami.  
            Vuela alto, vuela SkyAndes. ✈️
          </p>
        </div>

        {/* ENLACES */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Información</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <a href="#" className="hover:text-[#ff6b00] transition-colors duration-200">
                Términos y condiciones
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#ff6b00] transition-colors duration-200">
                Preguntas frecuentes
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#ff6b00] transition-colors duration-200">
                Trabaja con nosotros
              </a>
            </li>
          </ul>
        </div>

        {/* REDES SOCIALES */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Síguenos</h3>
          <div className="flex space-x-5">
            <a href="#" className="text-gray-400 hover:text-[#ff6b00] transition" aria-label="Facebook">
              <Facebook size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#ff6b00] transition" aria-label="Instagram">
              <Instagram size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#ff6b00] transition" aria-label="Twitter">
              <Twitter size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#ff6b00] transition" aria-label="LinkedIn">
              <Linkedin size={24} />
            </a>
          </div>
        </div>

        {/* CONTACTO */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Atención al cliente</h3>
          <p className="text-gray-400 text-sm">
            📞 +1 (305) 123-4567  
            <br />
            ✉️ soporte@skyandes.com
          </p>
          <p className="text-gray-500 text-xs mt-3">
            Horario: Lunes a Viernes, 9:00–18:00 (GMT-5)
          </p>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center mt-8 text-gray-500 text-sm pb-6">
        © {new Date().getFullYear()} SkyAndes Airlines. Todos los derechos reservados.
      </div>
    </footer>
  );
}
