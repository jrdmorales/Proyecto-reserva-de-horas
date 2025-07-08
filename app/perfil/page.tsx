'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  MapPin,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { serviciosDemo } from '../lib/data';
import { formatearPrecio, formatearFecha, obtenerEstadoColor } from '../lib/utils';
import { Usuario, Reserva } from '../types';

export default function PerfilPage() {
  const [usuario, setUsuario, isLoadingUser] = useLocalStorage<Usuario | null>('usuario_actual', null);
  const [reservas, setReservas] = useLocalStorage<Reserva[]>('reservas', []);
  const [editando, setEditando] = useState(false);
  const [datosEditados, setDatosEditados] = useState<Partial<Usuario>>({});

  useEffect(() => {
    if (!isLoadingUser && !usuario) {
      toast.error('Debes iniciar sesión');
      window.location.href = '/auth';
    }
  }, [usuario, isLoadingUser]);

  useEffect(() => {
    if (usuario) {
      setDatosEditados({
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono
      });
    }
  }, [usuario]);

  const reservasUsuario = reservas.filter(r => r.usuarioId === usuario?.id || r.usuarioId === 'temp-user');
  const reservasPendientes = reservasUsuario.filter(r => r.estado === 'pendiente' || r.estado === 'confirmada');
  const reservasCompletadas = reservasUsuario.filter(r => r.estado === 'completada');

  const guardarCambios = () => {
    if (!usuario) return;

    const usuarioActualizado = {
      ...usuario,
      ...datosEditados
    };

    setUsuario(usuarioActualizado);
    setEditando(false);
    toast.success('Perfil actualizado correctamente');
  };

  const cancelarEdicion = () => {
    setDatosEditados({
      nombre: usuario?.nombre,
      email: usuario?.email,
      telefono: usuario?.telefono
    });
    setEditando(false);
  };

  const cancelarReserva = (reservaId: string) => {
    if (confirm('¿Estás seguro de cancelar esta reserva?')) {
      setReservas(prev => prev.map(r => 
        r.id === reservaId ? { ...r, estado: 'cancelada' } : r
      ));
      toast.success('Reserva cancelada');
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mi Perfil
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gestiona tu información personal y revisa tus reservas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información Personal */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Información Personal
                </h2>
                {!editando ? (
                  <button
                    onClick={() => setEditando(true)}
                    className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={guardarCambios}
                      className="p-2 text-green-600 hover:text-green-700 transition-colors"
                    >
                      <Save className="h-5 w-5" />
                    </button>
                    <button
                      onClick={cancelarEdicion}
                      className="p-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Avatar */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-primary-500" />
                  </div>
                  {usuario.esAdmin && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      Administrador
                    </span>
                  )}
                </div>

                {/* Campos editables */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      Nombre
                    </label>
                    {editando ? (
                      <input
                        type="text"
                        value={datosEditados.nombre || ''}
                        onChange={(e) => setDatosEditados(prev => ({ ...prev, nombre: e.target.value }))}
                        className="input-field"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">
                        {usuario.nombre}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email
                    </label>
                    {editando ? (
                      <input
                        type="email"
                        value={datosEditados.email || ''}
                        onChange={(e) => setDatosEditados(prev => ({ ...prev, email: e.target.value }))}
                        className="input-field"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">
                        {usuario.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Teléfono
                    </label>
                    {editando ? (
                      <input
                        type="tel"
                        value={datosEditados.telefono || ''}
                        onChange={(e) => setDatosEditados(prev => ({ ...prev, telefono: e.target.value }))}
                        className="input-field"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">
                        {usuario.telefono}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Miembro desde
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {format(new Date(usuario.fechaRegistro), "MMMM 'de' yyyy", { locale: es })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="card mt-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Estadísticas
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total de reservas</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {reservasUsuario.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Reservas completadas</span>
                  <span className="font-bold text-green-600">
                    {reservasCompletadas.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Reservas pendientes</span>
                  <span className="font-bold text-blue-600">
                    {reservasPendientes.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reservas */}
          <div className="lg:col-span-2">
            {/* Reservas Próximas */}
            <div className="card mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Próximas Reservas
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {reservasPendientes.length} pendientes
                </span>
              </div>

              {reservasPendientes.length > 0 ? (
                <div className="space-y-4">
                  {reservasPendientes.map((reserva) => {
                    const servicio = serviciosDemo.find(s => s.id === reserva.servicioId);
                    return (
                      <motion.div
                        key={reserva.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {servicio?.nombre}
                              </h3>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${obtenerEstadoColor(reserva.estado)}`}>
                                {reserva.estado}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>{formatearFecha(reserva.fecha)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>{reserva.hora}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-primary-500">
                                  {formatearPrecio(servicio?.precio || 0)}
                                </span>
                              </div>
                            </div>

                            {reserva.notas && (
                              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm text-gray-600 dark:text-gray-400">
                                <strong>Notas:</strong> {reserva.notas}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col space-y-2 ml-4">
                            {reserva.estado !== 'cancelada' && (
                              <button
                                onClick={() => cancelarReserva(reserva.id)}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                title="Cancelar reserva"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No tienes reservas próximas
                  </p>
                  <a
                    href="/reservas"
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Reservar Ahora</span>
                  </a>
                </div>
              )}
            </div>

            {/* Historial de Reservas */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Historial de Reservas
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {reservasCompletadas.length} completadas
                </span>
              </div>

              {reservasCompletadas.length > 0 ? (
                <div className="space-y-3">
                  {reservasCompletadas.slice(0, 5).map((reserva) => {
                    const servicio = serviciosDemo.find(s => s.id === reserva.servicioId);
                    return (
                      <div
                        key={reserva.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {servicio?.nombre}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatearFecha(reserva.fecha)} • {reserva.hora}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatearPrecio(servicio?.precio || 0)}
                          </p>
                          <p className="text-xs text-green-600">
                            Completada
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  
                  {reservasCompletadas.length > 5 && (
                    <div className="text-center pt-4">
                      <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                        Ver todas las reservas ({reservasCompletadas.length})
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Aún no tienes reservas completadas
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}