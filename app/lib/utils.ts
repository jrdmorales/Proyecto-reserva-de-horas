import { format, addDays, isWeekend, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { HorarioDisponible, ConfiguracionHorario, Reserva } from '../types';

export const formatearFecha = (fecha: Date | string): string => {
  const date = typeof fecha === 'string' ? parseISO(fecha) : fecha;
  return format(date, 'dd/MM/yyyy', { locale: es });
};

export const formatearFechaCompleta = (fecha: Date | string): string => {
  const date = typeof fecha === 'string' ? parseISO(fecha) : fecha;
  return format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es });
};

export const formatearPrecio = (precio: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(precio);
};

export const generarHorasDisponibles = (
  horaInicio: string,
  horaFin: string,
  duracionServicio: number = 60,
  intervalo: number = 30
): string[] => {
  const horas: string[] = [];
  const [horaInicioH, horaInicioM] = horaInicio.split(':').map(Number);
  const [horaFinH, horaFinM] = horaFin.split(':').map(Number);
  
  const inicioMinutos = horaInicioH * 60 + horaInicioM;
  const finMinutos = horaFinH * 60 + horaFinM;
  
  for (let minutos = inicioMinutos; minutos <= finMinutos - duracionServicio; minutos += intervalo) {
    const hora = Math.floor(minutos / 60);
    const min = minutos % 60;
    horas.push(`${hora.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
  }
  
  return horas;
};

export const obtenerHorariosDisponibles = (
  configuracion: ConfiguracionHorario[],
  reservasExistentes: Reserva[],
  diasAdelante: number = 30
): HorarioDisponible[] => {
  const horarios: HorarioDisponible[] = [];
  const hoy = new Date();
  
  for (let i = 1; i <= diasAdelante; i++) {
    const fecha = addDays(hoy, i);
    const diaSemana = fecha.getDay();
    const configDia = configuracion.find(c => c.diaSemana === diaSemana && c.activo);
    
    if (configDia) {
      const fechaStr = format(fecha, 'yyyy-MM-dd');
      const horasDisponibles = generarHorasDisponibles(
        configDia.horaInicio,
        configDia.horaFin
      );
      
      // Filtrar horas ya reservadas
      const reservasDelDia = reservasExistentes.filter(r => {
        const fechaReserva = typeof r.fecha === 'string' ? parseISO(r.fecha) : r.fecha;
        return format(fechaReserva, 'yyyy-MM-dd') === fechaStr && r.estado !== 'cancelada';
      });
      
      const horasLibres = horasDisponibles.filter(hora => 
        !reservasDelDia.some(r => r.hora === hora)
      );
      
      if (horasLibres.length > 0) {
        horarios.push({
          fecha: fechaStr,
          horas: horasLibres
        });
      }
    }
  }
  
  return horarios;
};

export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarTelefono = (telefono: string): boolean => {
  const regex = /^(\+?56)?[0-9]{8,9}$/;
  return regex.test(telefono.replace(/\s/g, ''));
};

export const generarId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const calcularDuracionTotal = (servicios: string[], todosServicios: any[]): number => {
  return servicios.reduce((total, servicioId) => {
    const servicio = todosServicios.find(s => s.id === servicioId);
    return total + (servicio?.duracion || 0);
  }, 0);
};

export const obtenerEstadoColor = (estado: string): string => {
  switch (estado) {
    case 'pendiente': return 'bg-yellow-100 text-yellow-800';
    case 'confirmada': return 'bg-blue-100 text-blue-800';
    case 'completada': return 'bg-green-100 text-green-800';
    case 'cancelada': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};