# 🗓️ ReservaHoras - Sistema de Reservas Profesional

Una aplicación web moderna y completa para la gestión de reservas de horas, desarrollada con Next.js 14, TypeScript y Tailwind CSS. Ideal para profesionales independientes, peluquerías, centros de estética, consultas médicas y cualquier negocio que requiera un sistema de citas.

## ✨ Características Principales

### 🎯 Para Usuarios
- **Reserva Intuitiva**: Flujo paso a paso para reservar citas
- **Gestión de Perfil**: Edición de datos personales y seguimiento de reservas
- **Historial Completo**: Visualización de reservas pasadas y futuras
- **Cancelación Flexible**: Posibilidad de cancelar reservas pendientes
- **Responsive Design**: Funciona perfectamente en móvil, tablet y escritorio

### 👨‍💼 Para Administradores
- **Dashboard Completo**: Estadísticas en tiempo real del negocio
- **Gestión de Reservas**: Control total sobre todas las citas
- **Filtros Avanzados**: Búsqueda por fecha, servicio, cliente o estado
- **Exportación de Datos**: Descarga de reportes en formato CSV
- **Gestión de Servicios**: Administración de servicios y precios

### 🎨 Características Técnicas
- **Modo Oscuro/Claro**: Tema adaptable según preferencias del usuario
- **Animaciones Suaves**: Transiciones fluidas con Framer Motion
- **Validación de Formularios**: Validación robusta con Zod y React Hook Form
- **Almacenamiento Local**: Persistencia de datos con localStorage
- **Notificaciones**: Sistema de alertas con React Hot Toast
- **SEO Optimizado**: Metadata completa para motores de búsqueda

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd "Proyecto reserva de horas"
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📱 Uso de la Aplicación

### Para Usuarios Regulares

1. **Registro/Login**
   - Crear cuenta nueva o iniciar sesión
   - Los datos se almacenan localmente para la demo

2. **Realizar Reserva**
   - Ir a "Reservar" en el menú
   - Seguir el flujo paso a paso:
     - Seleccionar servicio
     - Elegir fecha disponible
     - Seleccionar hora
     - Completar datos personales
     - Confirmar reserva

3. **Gestionar Perfil**
   - Acceder a "Mi Perfil"
   - Editar información personal
   - Ver historial de reservas
   - Cancelar reservas pendientes

### Para Administradores

1. **Acceso Administrativo**
   - Email: `admin@reservas.com`
   - Contraseña: `admin123`

2. **Dashboard**
   - Ver estadísticas generales
   - Monitorear reservas del día
   - Revisar ingresos mensuales

3. **Gestión de Reservas**
   - Filtrar por fecha, servicio o estado
   - Cambiar estado de reservas
   - Exportar datos a CSV
   - Eliminar reservas

## 🛠️ Estructura del Proyecto

```
app/
├── components/          # Componentes reutilizables
│   ├── Header.tsx      # Navegación principal
│   └── Footer.tsx      # Pie de página
├── hooks/              # Hooks personalizados
│   ├── useLocalStorage.ts
│   └── useTheme.ts
├── lib/                # Utilidades y datos
│   ├── data.ts         # Datos de ejemplo
│   └── utils.ts        # Funciones auxiliares
├── types/              # Definiciones TypeScript
│   └── index.ts
├── admin/              # Panel administrativo
├── auth/               # Autenticación
├── perfil/             # Perfil de usuario
├── reservas/           # Sistema de reservas
├── globals.css         # Estilos globales
├── layout.tsx          # Layout principal
└── page.tsx            # Página de inicio
```

## 🎨 Personalización

### Colores y Tema
Los colores principales se pueden modificar en `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#f0f9ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  }
}
```

### Servicios
Modificar los servicios disponibles en `app/lib/data.ts`:

```typescript
export const serviciosDemo: Servicio[] = [
  {
    id: '1',
    nombre: 'Tu Servicio',
    descripcion: 'Descripción del servicio',
    duracion: 60, // minutos
    precio: 25000, // en pesos chilenos
    activo: true,
    categoria: 'Categoría'
  }
];
```

### Horarios de Atención
Configurar horarios en `app/lib/data.ts`:

```typescript
export const horarioConfiguracion: ConfiguracionHorario[] = [
  { diaSemana: 1, horaInicio: '09:00', horaFin: '18:00', activo: true }, // Lunes
  // ... más días
];
```

## 🔧 Funcionalidades Avanzadas

### Sistema de Notificaciones
- Confirmación de reservas
- Alertas de error
- Mensajes de éxito
- Notificaciones de cambios de estado

### Validación de Datos
- Validación de email
- Verificación de teléfono chileno
- Validación de formularios en tiempo real
- Sanitización de datos de entrada

### Gestión de Estados
- Estados de reserva: pendiente, confirmada, completada, cancelada
- Transiciones de estado controladas
- Historial de cambios

### Exportación de Datos
- Generación de CSV con todas las reservas
- Filtros aplicables a la exportación
- Formato compatible con Excel

## 📊 Datos de Demostración

La aplicación incluye datos de ejemplo para facilitar las pruebas:

- **10 reservas de ejemplo** con diferentes estados y fechas
- **5 servicios predefinidos** con precios y duraciones
- **Horarios de atención** configurados de lunes a sábado
- **Usuario administrador** con credenciales de prueba

## 🔒 Seguridad y Privacidad

- Validación de entrada en todos los formularios
- Sanitización de datos del usuario
- Verificación de permisos administrativos
- Almacenamiento local seguro (para demo)

## 🌐 Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge (últimas versiones)
- **Dispositivos**: Móvil, tablet, escritorio
- **Resoluciones**: Desde 320px hasta 4K
- **Accesibilidad**: Cumple estándares WCAG 2.1

## 🚀 Despliegue en Producción

### Vercel (Recomendado)
```bash
npm run build
npx vercel --prod
```

### Netlify
```bash
npm run build
# Subir carpeta .next a Netlify
```

### Servidor Propio
```bash
npm run build
npm start
```

## 🔄 Próximas Mejoras

- [ ] Integración con base de datos real (PostgreSQL/MongoDB)
- [ ] Sistema de pagos (Stripe/MercadoPago)
- [ ] Notificaciones por email/SMS
- [ ] API REST completa
- [ ] Aplicación móvil (React Native)
- [ ] Sistema de calificaciones
- [ ] Chat en tiempo real
- [ ] Integración con Google Calendar
- [ ] Múltiples profesionales
- [ ] Sistema de recordatorios automáticos

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico o consultas:
- Crear un issue en GitHub
- Email: soporte@reservahoras.cl
- Documentación: [Wiki del proyecto]

---

**Desarrollado con ❤️ para profesionales que valoran la eficiencia y la experiencia del usuario.**