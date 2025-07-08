export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  esAdmin: boolean;
  fechaRegistro: Date;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  duracion: number; // en minutos
  precio: number;
  activo: boolean;
  categoria: string;
}

export interface Reserva {
  id: string;
  usuarioId: string;
  servicioId: string;
  fecha: Date;
  hora: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  notas?: string;
  fechaCreacion: Date;
  usuario?: Usuario;
  servicio?: Servicio;
}

export interface HorarioDisponible {
  fecha: string;
  horas: string[];
}

export interface ConfiguracionHorario {
  diaSemana: number; // 0-6 (domingo-sábado)
  horaInicio: string;
  horaFin: string;
  activo: boolean;
}

export interface FormularioReserva {
  servicioId: string;
  fecha: string;
  hora: string;
  nombre: string;
  email: string;
  telefono: string;
  notas?: string;
}

export interface FiltrosAdmin {
  fecha?: string;
  servicio?: string;
  estado?: string;
  cliente?: string;
}