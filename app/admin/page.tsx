'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { 
  Calendar, 
  Users, 
  Clock, 
  DollarSign,
  Filter,
  Search,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Plus,
  Edit
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { serviciosDemo, generarReservasDemo } from '../lib/data';
import { formatearPrecio, formatearFecha, obtenerEstadoColor } from '../lib/utils';
import { Reserva, Usuario, FiltrosAdmin } from '../types';

export default function AdminPage() {
  const [reservas, setReservas] = useLocalStorage<Reserva[]>('reservas', []);
  const [usuario, , isLoadingUser] = useLocalStorage<Usuario | null>('usuario_actual', null);
  const [filtros, setFiltros] = useState<FiltrosAdmin>({});
  const [busqueda, setBusqueda] = useState('');
  const [vistaActual, setVistaActual] = useState<'dashboard' | 'reservas' | 'servicios'>('dashboard');

  // Verificar si es admin
  useEffect(() => {
    if (!isLoadingUser && !usuario?.esAdmin) {
      toast.error('Acceso denegado');
      window.location.href = '/';
    }
  }, [usuario, isLoadingUser]);

  // Generar datos demo si no hay reservas
  useEffect(() => {
    if (reservas.length === 0) {
      const reservasDemo = generarReservasDemo();
      setReservas(reservasDemo);
    }
  }, []);

  const reservasFiltradas = reservas.filter(reserva => {
    const cumpleFiltros = 
      (!filtros.fecha || format(reserva.fecha, 'yyyy-MM-dd') === filtros.fecha) &&
      (!filtros.servicio || reserva.servicioId === filtros.servicio) &&
      (!filtros.estado || reserva.estado === filtros.estado);

    const cumpleBusqueda = !busqueda || 
      reserva.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      (reserva.usuario?.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
      (reserva.usuario?.email || '').toLowerCase().includes(busqueda.toLowerCase());

    return cumpleFiltros && cumpleBusqueda;
  });

  const estadisticas = {
    totalReservas: reservas.length,
    reservasHoy: reservas.filter(r => 
      format(r.fecha, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    ).length,
    ingresosMes: reservas
      .filter(r => r.estado === 'completada' && 
        format(r.fecha, 'yyyy-MM') === format(new Date(), 'yyyy-MM'))
      .reduce((total, r) => {
        const servicio = serviciosDemo.find(s => s.id === r.servicioId);
        return total + (servicio?.precio || 0);
      }, 0),
    clientesUnicos: new Set(reservas.map(r => r.usuarioId)).size
  };

  const cambiarEstadoReserva = (reservaId: string, nuevoEstado: Reserva['estado']) => {
    setReservas(prev => prev.map(r => 
      r.id === reservaId ? { ...r, estado: nuevoEstado } : r
    ));
    toast.success('Estado actualizado');
  };

  const eliminarReserva = (reservaId: string) => {
    if (confirm('¿Estás seguro de eliminar esta reserva?')) {
      setReservas(prev => prev.filter(r => r.id !== reservaId));
      toast.success('Reserva eliminada');
    }
  };

  const exportarReservas = () => {
    const csv = [
      ['ID', 'Cliente', 'Email', 'Servicio', 'Fecha', 'Hora', 'Estado', 'Precio'].join(','),
      ...reservasFiltradas.map(r => {
        const servicio = serviciosDemo.find(s => s.id === r.servicioId);
        return [
          r.id,
          r.usuario?.nombre || 'N/A',
          r.usuario?.email || 'N/A',
          servicio?.nombre || 'N/A',
          formatearFecha(r.fecha),
          r.hora,
          r.estado,
          servicio?.precio || 0
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservas-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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

  if (!usuario?.esAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gestiona reservas, servicios y obtén estadísticas de tu negocio
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Calendar },
                { id: 'reservas', label: 'Reservas', icon: Users },
                { id: 'servicios', label: 'Servicios', icon: Clock }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setVistaActual(id as any)}
                  className={`
                    flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm
                    ${vistaActual === id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard View */}
        {vistaActual === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Reservas
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {estadisticas.totalReservas}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Reservas Hoy
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {estadisticas.reservasHoy}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Ingresos Mes
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatearPrecio(estadisticas.ingresosMes)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Clientes Únicos
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {estadisticas.clientesUnicos}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Reservations */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Reservas Recientes
                </h2>
                <button
                  onClick={() => setVistaActual('reservas')}
                  className="text-primary-500 hover:text-primary-600 font-medium"
                >
                  Ver todas
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Servicio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {reservas.slice(0, 5).map((reserva) => {
                      const servicio = serviciosDemo.find(s => s.id === reserva.servicioId);
                      return (
                        <tr key={reserva.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              Cliente #{reserva.usuarioId.slice(-4)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {servicio?.nombre}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {formatearFecha(reserva.fecha)} {reserva.hora}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${obtenerEstadoColor(reserva.estado)}`}>
                              {reserva.estado}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Reservas View */}
        {vistaActual === 'reservas' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Filters and Search */}
            <div className="card mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por ID, cliente o email..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <select
                    value={filtros.estado || ''}
                    onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value || undefined }))}
                    className="input-field"
                  >
                    <option value="">Todos los estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>

                  <select
                    value={filtros.servicio || ''}
                    onChange={(e) => setFiltros(prev => ({ ...prev, servicio: e.target.value || undefined }))}
                    className="input-field"
                  >
                    <option value="">Todos los servicios</option>
                    {serviciosDemo.map(servicio => (
                      <option key={servicio.id} value={servicio.id}>
                        {servicio.nombre}
                      </option>
                    ))}
                  </select>

                  <input
                    type="date"
                    value={filtros.fecha || ''}
                    onChange={(e) => setFiltros(prev => ({ ...prev, fecha: e.target.value || undefined }))}
                    className="input-field"
                  />

                  <button
                    onClick={exportarReservas}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Exportar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Reservations Table */}
            <div className="card">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Servicio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Fecha y Hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {reservasFiltradas.map((reserva) => {
                      const servicio = serviciosDemo.find(s => s.id === reserva.servicioId);
                      return (
                        <tr key={reserva.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                            #{reserva.id.slice(-6)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              Cliente #{reserva.usuarioId.slice(-4)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {servicio?.nombre}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {servicio?.duracion} min
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {formatearFecha(reserva.fecha)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {reserva.hora}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={reserva.estado}
                              onChange={(e) => cambiarEstadoReserva(reserva.id, e.target.value as any)}
                              className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${obtenerEstadoColor(reserva.estado)}`}
                            >
                              <option value="pendiente">Pendiente</option>
                              <option value="confirmada">Confirmada</option>
                              <option value="completada">Completada</option>
                              <option value="cancelada">Cancelada</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {formatearPrecio(servicio?.precio || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => alert(`Detalles de reserva ${reserva.id}`)}
                                className="text-primary-600 hover:text-primary-900 dark:text-primary-400"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => eliminarReserva(reserva.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {reservasFiltradas.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No se encontraron reservas con los filtros aplicados
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Servicios View */}
        {vistaActual === 'servicios' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gestión de Servicios
              </h2>
              <button className="btn-primary flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Nuevo Servicio</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviciosDemo.map((servicio) => (
                <div key={servicio.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {servicio.nombre}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {servicio.categoria}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400">
                        <Edit className="h-4 w-4" />
                      </button>
                      <div className={`w-3 h-3 rounded-full ${servicio.activo ? 'bg-green-400' : 'bg-red-400'}`} />
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {servicio.descripcion}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{servicio.duracion} min</span>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-primary-500">
                      {formatearPrecio(servicio.precio)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}