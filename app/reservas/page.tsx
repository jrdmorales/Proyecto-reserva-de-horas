'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  CheckCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { serviciosDemo, horarioConfiguracion } from '../lib/data';
import { obtenerHorariosDisponibles, formatearPrecio, generarId } from '../lib/utils';
import { Servicio, Reserva, FormularioReserva } from '../types';

const esquemaReserva = z.object({
  servicioId: z.string().min(1, 'Selecciona un servicio'),
  fecha: z.string().min(1, 'Selecciona una fecha'),
  hora: z.string().min(1, 'Selecciona una hora'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(8, 'Teléfono inválido'),
  notas: z.string().optional(),
});

type FormData = z.infer<typeof esquemaReserva>;

export default function ReservasPage() {
  const [paso, setPaso] = useState(1);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [reservas, setReservas] = useLocalStorage<Reserva[]>('reservas', []);
  const [horariosDisponibles, setHorariosDisponibles] = useState<any[]>([]);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(esquemaReserva)
  });

  useEffect(() => {
    const horarios = obtenerHorariosDisponibles(horarioConfiguracion, reservas);
    setHorariosDisponibles(horarios);
  }, [reservas]);

  const seleccionarServicio = (servicio: Servicio) => {
    setServicioSeleccionado(servicio);
    setValue('servicioId', servicio.id);
    setPaso(2);
  };

  const seleccionarFecha = (fecha: string) => {
    setFechaSeleccionada(fecha);
    setValue('fecha', fecha);
    setPaso(3);
  };

  const seleccionarHora = (hora: string) => {
    setHoraSeleccionada(hora);
    setValue('hora', hora);
    setPaso(4);
  };

  const onSubmit = (data: FormData) => {
    const nuevaReserva: Reserva = {
      id: generarId(),
      usuarioId: 'temp-user',
      servicioId: data.servicioId,
      fecha: parseISO(data.fecha),
      hora: data.hora,
      estado: 'pendiente',
      notas: data.notas,
      fechaCreacion: new Date(),
      servicio: servicioSeleccionado!,
    };

    setReservas(prev => [...prev, nuevaReserva]);
    toast.success('¡Reserva creada exitosamente!');
    setPaso(5);
  };

  const reiniciarReserva = () => {
    setPaso(1);
    setServicioSeleccionado(null);
    setFechaSeleccionada('');
    setHoraSeleccionada('');
  };

  const fechasDisponibles = horariosDisponibles.slice(0, 14); // Próximas 2 semanas
  const horasDelDia = horariosDisponibles.find(h => h.fecha === fechaSeleccionada)?.horas || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Reservar Hora
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Sigue estos simples pasos para reservar tu cita
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold
                  ${paso >= num 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {paso > num ? <CheckCircle className="h-6 w-6" /> : num}
                </div>
                {num < 5 && (
                  <div className={`
                    w-12 h-1 mx-2
                    ${paso > num ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Servicio</span>
            <span>Fecha</span>
            <span>Hora</span>
            <span>Datos</span>
            <span>Confirmación</span>
          </div>
        </div>

        {/* Contenido por pasos */}
        <div className="card">
          {/* Paso 1: Seleccionar Servicio */}
          {paso === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Selecciona un Servicio
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {serviciosDemo.filter(s => s.activo).map((servicio) => (
                  <div
                    key={servicio.id}
                    onClick={() => seleccionarServicio(servicio)}
                    className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 hover:shadow-lg transition-all duration-200 group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-500">
                        {servicio.nombre}
                      </h3>
                      <span className="text-xl font-bold text-primary-500">
                        {formatearPrecio(servicio.precio)}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {servicio.descripcion}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{servicio.duracion} min</span>
                      </div>
                      <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                        {servicio.categoria}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Paso 2: Seleccionar Fecha */}
          {paso === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Selecciona una Fecha
                </h2>
                <button
                  onClick={() => setPaso(1)}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-500"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Cambiar Servicio</span>
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-primary-500">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-700">
                      {servicioSeleccionado?.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-700">
                      {servicioSeleccionado?.duracion} min • {formatearPrecio(servicioSeleccionado?.precio || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {fechasDisponibles.map((horario) => {
                  const fecha = parseISO(horario.fecha);
                  const esHoy = format(fecha, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                  
                  return (
                    <button
                      key={horario.fecha}
                      onClick={() => seleccionarFecha(horario.fecha)}
                      className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 hover:shadow-md transition-all duration-200 text-center"
                    >
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {format(fecha, 'EEE', { locale: es })}
                      </div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {format(fecha, 'dd')}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {format(fecha, 'MMM', { locale: es })}
                      </div>
                      {esHoy && (
                        <div className="text-xs text-primary-500 font-medium mt-1">
                          Hoy
                        </div>
                      )}
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                        {horario.horas.length} disponibles
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Paso 3: Seleccionar Hora */}
          {paso === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Selecciona una Hora
                </h2>
                <button
                  onClick={() => setPaso(2)}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-500"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Cambiar Fecha</span>
                </button>
              </div>

              <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 text-primary-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-900">
                      {format(parseISO(fechaSeleccionada), "EEEE, dd 'de' MMMM", { locale: es })}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-700">
                      {servicioSeleccionado?.nombre} • {servicioSeleccionado?.duracion} min
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {horasDelDia.map((hora: string) => (
                  <button
                    key={hora}
                    onClick={() => seleccionarHora(hora)}
                    className="p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 hover:shadow-md transition-all duration-200 text-center font-medium text-gray-900 dark:text-white"
                  >
                    {hora}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Paso 4: Formulario de Datos */}
          {paso === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Completa tus Datos
                </h2>
                <button
                  onClick={() => setPaso(3)}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-500"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Cambiar Hora</span>
                </button>
              </div>

              <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary-500" />
                    <span className="text-sm text-gray-900 dark:text-gray-900">
                      {servicioSeleccionado?.nombre}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary-500" />
                    <span className="text-sm text-gray-900 dark:text-gray-900">
                      {format(parseISO(fechaSeleccionada), 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary-500" />
                    <span className="text-sm text-gray-900 dark:text-gray-900">
                      {horaSeleccionada}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      Nombre Completo
                    </label>
                    <input
                      {...register('nombre')}
                      type="text"
                      className="input-field"
                      placeholder="Tu nombre completo"
                    />
                    {errors.nombre && (
                      <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="input-field"
                      placeholder="tu@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Teléfono
                  </label>
                  <input
                    {...register('telefono')}
                    type="tel"
                    className="input-field"
                    placeholder="+56 9 1234 5678"
                  />
                  {errors.telefono && (
                    <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MessageSquare className="inline h-4 w-4 mr-1" />
                    Notas Adicionales (Opcional)
                  </label>
                  <textarea
                    {...register('notas')}
                    rows={3}
                    className="input-field"
                    placeholder="Alguna información adicional que quieras compartir..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>Confirmar Reserva</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Paso 5: Confirmación */}
          {paso === 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="mb-8">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  ¡Reserva Confirmada!
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Tu cita ha sido reservada exitosamente. Recibirás un email de confirmación pronto.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Detalles de tu Reserva
                </h3>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Servicio:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {servicioSeleccionado?.nombre}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Fecha:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {format(parseISO(fechaSeleccionada), "dd 'de' MMMM, yyyy", { locale: es })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Hora:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {horaSeleccionada}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duración:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {servicioSeleccionado?.duracion} minutos
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-gray-600 dark:text-gray-400">Precio:</span>
                    <span className="font-bold text-lg text-primary-500">
                      {formatearPrecio(servicioSeleccionado?.precio || 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={reiniciarReserva}
                  className="btn-secondary"
                >
                  Hacer Otra Reserva
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn-primary"
                >
                  Volver al Inicio
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}