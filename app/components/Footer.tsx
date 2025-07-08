import { Calendar, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-primary-500 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">ReservaHoras</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Plataforma profesional para la gestión de reservas de horas. 
              Simplifica tu negocio y mejora la experiencia de tus clientes.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/reservas" className="text-gray-400 hover:text-white transition-colors">
                  Reservar Hora
                </a>
              </li>
              <li>
                <a href="/servicios" className="text-gray-400 hover:text-white transition-colors">
                  Nuestros Servicios
                </a>
              </li>
              <li>
                <a href="/sobre-nosotros" className="text-gray-400 hover:text-white transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="/contacto" className="text-gray-400 hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
              <li>
                <a href="/politicas" className="text-gray-400 hover:text-white transition-colors">
                  Políticas de Privacidad
                </a>
              </li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Av. Providencia 1234, Santiago, Chile
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  +56 9 1234 5678
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  contacto@reservahoras.cl
                </span>
              </div>
            </div>

            {/* Horarios de atención */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Horarios de Atención</h4>
              <div className="text-gray-400 text-sm space-y-1">
                <div>Lun - Vie: 9:00 - 18:00</div>
                <div>Sábado: 10:00 - 15:00</div>
                <div>Domingo: Cerrado</div>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 ReservaHoras. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/terminos" className="text-gray-400 hover:text-white text-sm transition-colors">
                Términos de Uso
              </a>
              <a href="/privacidad" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacidad
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}