import { Servicio, Reserva, Usuario, ConfiguracionHorario } from '../types';

// Datos de ejemplo para la demo
export const serviciosDemo: Servicio[] = [
  {
    id: '1',
    nombre: 'Corte de Cabello',
    descripcion: 'Corte profesional personalizado según tu estilo',
    duracion: 45,
    precio: 25000,
    activo: true,
    categoria: 'Peluquería'
  },
  {
    id: '2',
    nombre: 'Coloración',
    descripcion: 'Tinte y coloración completa con productos premium',
    duracion: 120,
    precio: 45000,
    activo: true,
    categoria: 'Peluquería'
  },
  {
    id: '3',
    nombre: 'Manicure',
    descripcion: 'Cuidado completo de uñas con esmaltado',
    duracion: 60,
    precio: 18000,
    activo: true,
    categoria: 'Estética'
  },
  {
    id: '4',
    nombre: 'Masaje Relajante',
    descripcion: 'Masaje terapéutico para aliviar tensiones',
    duracion: 90,
    precio: 35000,
    activo: true,
    categoria: 'Bienestar'
  },
  {
    id: '5',
    nombre: 'Limpieza Facial',
    descripcion: 'Tratamiento facial profundo con productos naturales',
    duracion: 75,
    precio: 30000,
    activo: true,
    categoria: 'Estética'
  }
];

export const usuariosDemo: Usuario[] = [
  {
    id: 'admin',
    nombre: 'Administrador',
    email: 'admin@reservas.com',
    telefono: '+56912345678',
    esAdmin: true,
    fechaRegistro: new Date('2024-01-01')
  }
];

export const horarioConfiguracion: ConfiguracionHorario[] = [
  { diaSemana: 1, horaInicio: '09:00', horaFin: '18:00', activo: true }, // Lunes
  { diaSemana: 2, horaInicio: '09:00', horaFin: '18:00', activo: true }, // Martes
  { diaSemana: 3, horaInicio: '09:00', horaFin: '18:00', activo: true }, // Miércoles
  { diaSemana: 4, horaInicio: '09:00', horaFin: '18:00', activo: true }, // Jueves
  { diaSemana: 5, horaInicio: '09:00', horaFin: '17:00', activo: true }, // Viernes
  { diaSemana: 6, horaInicio: '10:00', horaFin: '15:00', activo: true }, // Sábado
  { diaSemana: 0, horaInicio: '10:00', horaFin: '14:00', activo: false }, // Domingo
];

// Funciones para manejar localStorage
export const getStorageData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setStorageData = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Funciones para generar datos de ejemplo
export const generarReservasDemo = (): Reserva[] => {
  const reservas: Reserva[] = [];
  const fechaBase = new Date();
  
  for (let i = 0; i < 10; i++) {
    const fecha = new Date(fechaBase);
    fecha.setDate(fecha.getDate() + Math.floor(Math.random() * 30));
    
    reservas.push({
      id: `demo-${i + 1}`,
      usuarioId: 'demo-user',
      servicioId: serviciosDemo[Math.floor(Math.random() * serviciosDemo.length)].id,
      fecha,
      hora: ['09:00', '10:30', '14:00', '15:30', '16:00'][Math.floor(Math.random() * 5)],
      estado: ['pendiente', 'confirmada', 'completada'][Math.floor(Math.random() * 3)] as any,
      notas: i % 3 === 0 ? 'Reserva de ejemplo con notas adicionales' : undefined,
      fechaCreacion: new Date(fecha.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    });
  }
  
  return reservas;
};