'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Smartphone,
  Shield,
  Zap
} from 'lucide-react';

export default function HomePage() {
  const servicios = [
    {
      icon: <Calendar className="h-8 w-8" />,
      titulo: "Reservas Fáciles",
      descripcion: "Sistema intuitivo para reservar tu hora en segundos"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      titulo: "Horarios Flexibles",
      descripcion: "Disponibilidad amplia para adaptarse a tu agenda"
    },
    {
      icon: <Users className="h-8 w-8" />,
      titulo: "Profesionales Expertos",
      descripcion: "Equipo calificado y con años de experiencia"
    },
    {
      icon: <Star className="h-8 w-8" />,
      titulo: "Calidad Garantizada",
      descripcion: "Servicios de primera calidad con garantía"
    }
  ];

  const caracteristicas = [
    {
      icon: <Smartphone className="h-6 w-6" />,
      titulo: "Totalmente Responsivo",
      descripcion: "Funciona perfectamente en móvil, tablet y escritorio"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      titulo: "Datos Seguros",
      descripcion: "Tu información personal está protegida y segura"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      titulo: "Confirmación Instantánea",
      descripcion: "Recibe confirmación inmediata de tu reserva"
    }
  ];

  const testimonios = [
    {
      nombre: "María González",
      comentario: "Excelente servicio, muy fácil de usar y los profesionales son increíbles.",
      rating: 5
    },
    {
      nombre: "Carlos Rodríguez",
      comentario: "La mejor experiencia que he tenido reservando citas online. Muy recomendado.",
      rating: 5
    },
    {
      nombre: "Ana Martínez",
      comentario: "Súper conveniente y rápido. El sistema de reservas es muy intuitivo.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 animate-gradient opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Reserva tu hora de manera{' '}
                <span className="text-primary-500">profesional</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Plataforma moderna y fácil de usar para gestionar tus citas. 
                Ahorra tiempo y mejora tu experiencia con nuestro sistema inteligente de reservas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/reservas" className="btn-primary inline-flex items-center justify-center group">
                  Reservar Ahora
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#servicios" className="btn-secondary inline-flex items-center justify-center">
                  Ver Servicios
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Próxima Cita
                  </h3>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary-500" />
                    <span className="text-gray-600 dark:text-gray-300">Mañana, 15:30</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-primary-500" />
                    <span className="text-gray-600 dark:text-gray-300">Corte de Cabello</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-600 dark:text-green-400">Confirmada</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section id="servicios" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Ofrecemos una experiencia completa y profesional para todas tus necesidades
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicios.map((servicio, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className="text-primary-500 mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {servicio.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {servicio.titulo}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {servicio.descripcion}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Características Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Tecnología moderna para tu comodidad
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Nuestra plataforma está diseñada con las últimas tecnologías para 
                ofrecerte la mejor experiencia posible.
              </p>
              
              <div className="space-y-6">
                {caracteristicas.map((caracteristica, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                      <div className="text-primary-500">
                        {caracteristica.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {caracteristica.titulo}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {caracteristica.descripcion}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Panel de Control</h3>
                <div className="space-y-4">
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Reservas Hoy</span>
                      <span className="text-2xl font-bold">12</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-white rounded-full h-2 w-3/4"></div>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Satisfacción</span>
                      <span className="text-2xl font-bold">98%</span>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonios Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Testimonios reales de personas satisfechas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonios.map((testimonio, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonio.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  "{testimonio.comentario}"
                </p>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {testimonio.nombre}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              ¿Listo para reservar tu próxima cita?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Únete a miles de clientes satisfechos y experimenta nuestro servicio profesional
            </p>
            <Link 
              href="/reservas" 
              className="inline-flex items-center px-8 py-4 bg-white text-primary-500 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Reservar Mi Hora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}