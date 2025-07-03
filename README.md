# TurnosOnline - Sistema de Reservas

Sistema web moderno y responsivo para reservar turnos online con perfiles de cliente y administrador. Desarrollado con React, TypeScript, Tailwind CSS y Supabase.

## 🚀 Características Principales

### 👤 Para Clientes
- ✅ **Registro e inicio de sesión** con validación de email
- ✅ **Calendario interactivo** para ver disponibilidad en tiempo real
- ✅ **Selección de servicios** (corte, coloración, limpieza facial, manicura, etc.)
- ✅ **Reserva intuitiva** de fecha y hora con confirmación inmediata
- ✅ **Gestión personal** de turnos con historial completo
- ✅ **Cancelación fácil** de reservas con confirmación
- ✅ **Notas adicionales** para especificar preferencias
- ✅ **Vista responsiva** optimizada para móvil y desktop

### 👨‍💼 Para Administradores
- ✅ **Dashboard completo** con estadísticas en tiempo real
- ✅ **Gestión avanzada** de turnos (confirmar, cancelar, completar)
- ✅ **Administración de servicios** con precios y duraciones
- ✅ **Configuración de horarios** de atención por día
- ✅ **Fechas especiales** y feriados personalizables
- ✅ **Agenda visual** diaria, semanal y mensual
- ✅ **Métricas de negocio** con gráficos interactivos
- ✅ **Filtros avanzados** por fecha, estado y servicio
- ✅ **Resúmenes automáticos** de ingresos y turnos

## 🎨 Diseño y UX

### Estilo Visual
- **Diseño moderno** con paleta de colores profesional
- **Fondo blanco limpio** con acentos azules (#3b82f6)
- **Íconos vectoriales** de Lucide React para claridad
- **Tipografía legible** con jerarquía visual clara
- **Espaciado consistente** siguiendo principios de diseño

### Experiencia de Usuario
- **Navegación intuitiva** con breadcrumbs y estados activos
- **Feedback visual** con notificaciones toast
- **Animaciones suaves** en transiciones y hover states
- **Carga progresiva** de contenido
- **Accesibilidad** con contraste adecuado y navegación por teclado

### Responsividad
- **Mobile-first** design approach
- **Breakpoints optimizados** para tablet y desktop
- **Grid adaptativo** que se reorganiza según el dispositivo
- **Touch-friendly** con botones y áreas de toque apropiadas

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para mayor robustez
- **Vite** - Build tool rápido y moderno
- **Tailwind CSS** - Framework de utilidades CSS
- **React Router DOM** - Navegación SPA
- **React Calendar** - Componente de calendario interactivo
- **Recharts** - Gráficos y visualizaciones
- **React Hot Toast** - Sistema de notificaciones
- **Lucide React** - Iconografía moderna
- **Date-fns** - Manipulación de fechas

### Backend y Base de Datos
- **Supabase** - Backend as a Service
- **PostgreSQL** - Base de datos relacional
- **Row Level Security (RLS)** - Seguridad a nivel de fila
- **Real-time subscriptions** - Actualizaciones en tiempo real
- **Edge Functions** - Funciones serverless (preparado)

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Compatibilidad de navegadores

## 📊 Arquitectura de Base de Datos

### Tablas Principales

#### `profiles`
```sql
- id (uuid, FK a auth.users)
- name (text)
- role (enum: client, admin)
- phone (text, opcional)
- created_at, updated_at (timestamps)
```

#### `services`
```sql
- id (uuid, PK)
- name (text)
- description (text)
- duration (integer, minutos)
- price (decimal)
- active (boolean)
- created_at, updated_at (timestamps)
```

#### `appointments`
```sql
- id (uuid, PK)
- client_id (uuid, FK a profiles)
- service_id (uuid, FK a services)
- appointment_date (date)
- appointment_time (time)
- status (enum: confirmed, cancelled, completed)
- notes (text, opcional)
- created_at, updated_at (timestamps)
```

#### `business_schedule`
```sql
- id (uuid, PK)
- day_of_week (integer, 0-6)
- start_time, end_time (time)
- break_start, break_end (time, opcional)
- is_active (boolean)
```

#### `special_dates`
```sql
- id (uuid, PK)
- date (date)
- reason (text)
- is_closed (boolean)
```

### Políticas de Seguridad (RLS)
- **Clientes**: Solo pueden ver y modificar sus propios datos
- **Administradores**: Acceso completo a todos los recursos
- **Servicios**: Lectura pública para servicios activos
- **Horarios**: Lectura pública, modificación solo admin

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd turnos-online-locales
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Supabase**
   - Crear proyecto en [Supabase](https://supabase.com)
   - Ejecutar migraciones desde `supabase/migrations/`
   - Configurar autenticación por email

4. **Variables de entorno**
```bash
cp .env.example .env
```
Completar con tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

5. **Iniciar desarrollo**
```bash
npm run dev
```

### Scripts Disponibles
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Linting del código

## 👥 Cuentas de Prueba

Para probar el sistema sin configurar Supabase:

### Cliente
- **Email**: cualquier email (ej: `cliente@test.com`)
- **Contraseña**: cualquiera
- **Funciones**: Reservar turnos, ver calendario, gestionar citas

### Administrador
- **Email**: email que contenga "admin" (ej: `admin@test.com`)
- **Contraseña**: cualquiera
- **Funciones**: Dashboard completo, gestión de turnos y servicios

## 📱 Funcionalidades Detalladas

### Sistema de Reservas
- **Validación de disponibilidad** en tiempo real
- **Prevención de doble reserva** en el mismo horario
- **Cálculo automático** de duración según servicio
- **Confirmación inmediata** con detalles completos

### Dashboard Administrativo
- **Estadísticas en vivo**: turnos del día, semana y mes
- **Gráficos interactivos**: barras y circulares con Recharts
- **Filtros dinámicos**: por fecha, estado, servicio
- **Acciones rápidas**: acceso directo a funciones principales

### Gestión de Servicios
- **CRUD completo**: crear, leer, actualizar, eliminar
- **Configuración flexible**: precio, duración, descripción
- **Estado activo/inactivo** para control de disponibilidad

### Configuración de Horarios
- **Horarios por día** de la semana
- **Horarios de descanso** configurables
- **Fechas especiales** y feriados
- **Validación automática** de conflictos

### Sistema de Notificaciones
- **Toast notifications** para feedback inmediato
- **Estados visuales** claros (confirmado, cancelado, completado)
- **Alertas de validación** para prevenir errores

## 🔮 Funcionalidades Futuras

### Próximas Implementaciones
- [ ] **Integración WhatsApp API** para notificaciones
- [ ] **Sistema de emails** automatizado
- [ ] **Recordatorios automáticos** 24h antes
- [ ] **Pagos online** con Stripe/MercadoPago
- [ ] **Sistema de calificaciones** y reseñas
- [ ] **Múltiples sucursales** y profesionales
- [ ] **App móvil nativa** con React Native
- [ ] **Integración con Google Calendar**
- [ ] **Sistema de fidelización** con puntos
- [ ] **Reportes avanzados** en PDF

### Mejoras Técnicas Planificadas
- [ ] **PWA** (Progressive Web App)
- [ ] **Modo offline** con sincronización
- [ ] **Tests automatizados** con Jest/Vitest
- [ ] **CI/CD pipeline** con GitHub Actions
- [ ] **Monitoreo** con Sentry
- [ ] **Analytics** con Google Analytics
- [ ] **SEO optimization** para landing pages

## 🔧 Personalización

### Temas y Colores
El sistema usa CSS custom properties para fácil personalización:
```css
:root {
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  /* Personalizar según marca */
}
```

### Servicios por Defecto
Modificar en `src/contexts/AppointmentContext.tsx`:
```typescript
const defaultServices = [
  {
    name: 'Tu Servicio',
    duration: 60,
    price: 5000,
    description: 'Descripción del servicio'
  }
];
```

### Horarios de Atención
Configurar en la migración SQL o desde el panel admin.

## 📈 Métricas y Analytics

### Dashboard Incluye
- **Turnos por período**: día, semana, mes
- **Ingresos totales** calculados automáticamente
- **Servicios más populares** con gráfico circular
- **Tendencias semanales** con gráfico de barras
- **Estado de turnos** con contadores en vivo

### Exportación de Datos
- **Formato JSON** para integración con otros sistemas
- **Preparado para CSV/Excel** export
- **API endpoints** listos para reportes externos

## 🛡️ Seguridad

### Autenticación
- **Supabase Auth** con email/password
- **JWT tokens** seguros
- **Session management** automático

### Autorización
- **Role-based access control** (RBAC)
- **Row Level Security** en base de datos
- **Políticas granulares** por tabla

### Validación
- **Frontend validation** con TypeScript
- **Backend constraints** en PostgreSQL
- **Sanitización** de inputs del usuario

## 🤝 Contribución

### Estructura del Proyecto
```
src/
├── components/     # Componentes reutilizables
├── contexts/       # Context providers (Auth, Appointments)
├── pages/          # Páginas principales
│   └── admin/      # Páginas de administración
├── types/          # Definiciones de TypeScript
└── utils/          # Utilidades y helpers
```

### Convenciones de Código
- **TypeScript strict mode** habilitado
- **ESLint** para consistencia
- **Componentes funcionales** con hooks
- **Props interfaces** tipadas
- **Naming conventions** descriptivas

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles.

## 📞 Soporte

Para soporte técnico o consultas:
- **Issues**: Usar GitHub Issues para bugs y features
- **Documentación**: README y comentarios en código
- **Ejemplos**: Código de ejemplo en cada componente

---

**Desarrollado con ❤️ usando React, TypeScript y Supabase**