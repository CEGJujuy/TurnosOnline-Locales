# TurnosOnline - Sistema de Reservas

Sistema web moderno y responsivo para reservar turnos online con perfiles de cliente y administrador.

## 🚀 Características

### Para Clientes
- ✅ Registro e inicio de sesión
- ✅ Ver disponibilidad en calendario
- ✅ Seleccionar servicios (corte, coloración, limpieza facial, etc.)
- ✅ Elegir fecha y hora
- ✅ Confirmar reservas
- ✅ Gestionar turnos personales
- ✅ Cancelar turnos

### Para Administradores
- ✅ Dashboard con estadísticas
- ✅ Gestionar horarios de atención
- ✅ Ver agenda diaria, semanal y mensual
- ✅ Cancelar/confirmar turnos
- ✅ Gestionar servicios y precios
- ✅ Configurar fechas especiales
- ✅ Visualizar métricas de negocio

## 🎨 Diseño

- **Estilo moderno** con fondo blanco y botones azules
- **Íconos limpios** usando Lucide React
- **Totalmente responsivo** para móvil, tablet y desktop
- **Interfaz intuitiva** con excelente UX

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS
- **Routing**: React Router DOM
- **Calendario**: React Calendar
- **Gráficos**: Recharts
- **Notificaciones**: React Hot Toast
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth

## 📊 Base de Datos

El sistema incluye las siguientes tablas:

- `profiles` - Perfiles de usuario
- `services` - Servicios disponibles
- `appointments` - Reservas de turnos
- `business_schedule` - Horarios de atención
- `special_dates` - Fechas especiales/feriados

## 🚀 Instalación

1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Configura Supabase (ver sección siguiente)
4. Inicia el servidor: `npm run dev`

## ⚙️ Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta las migraciones SQL desde `supabase/migrations/`
3. Copia `.env.example` a `.env` y completa las variables:
   ```
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima
   ```

## 👥 Cuentas de Prueba

Para probar el sistema:
- **Cliente**: cualquier email sin "admin"
- **Administrador**: email que contenga "admin"
- **Contraseña**: cualquiera (modo demo)

## 📱 Funcionalidades Adicionales

- **Notificaciones**: Sistema de alertas integrado
- **Validaciones**: Prevención de doble reserva
- **Filtros**: Por fecha, estado, servicio
- **Estadísticas**: Gráficos de turnos y ingresos
- **Responsive**: Optimizado para todos los dispositivos

## 🔮 Próximas Funcionalidades

- [ ] Integración con WhatsApp API
- [ ] Notificaciones por email
- [ ] Sistema de recordatorios
- [ ] Pagos online
- [ ] Múltiples sucursales
- [ ] App móvil

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles.