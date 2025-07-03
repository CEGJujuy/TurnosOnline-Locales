import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Settings, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppointments } from '../../contexts/AppointmentContext';
import { format, startOfWeek, endOfWeek, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

const AdminDashboard: React.FC = () => {
  const { appointments, services } = useAppointments();

  const today = new Date();
  const thisWeek = { start: startOfWeek(today, { weekStartsOn: 1 }), end: endOfWeek(today, { weekStartsOn: 1 }) };
  const thisMonth = { start: startOfMonth(today), end: endOfMonth(today) };

  // Estadísticas generales
  const todayAppointments = appointments.filter(apt => 
    apt.date === format(today, 'yyyy-MM-dd') && apt.status !== 'cancelled'
  ).length;

  const weeklyAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return isWithinInterval(aptDate, thisWeek) && apt.status !== 'cancelled';
  }).length;

  const monthlyAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return isWithinInterval(aptDate, thisMonth) && apt.status !== 'cancelled';
  }).length;

  const totalRevenue = appointments
    .filter(apt => apt.status === 'completed')
    .reduce((total, apt) => {
      const service = services.find(s => s.id === apt.serviceId);
      return total + (service?.price || 0);
    }, 0);

  // Datos para gráficos
  const serviceStats = services.map(service => ({
    name: service.name,
    appointments: appointments.filter(apt => apt.serviceId === service.id && apt.status !== 'cancelled').length,
    revenue: appointments
      .filter(apt => apt.serviceId === service.id && apt.status === 'completed')
      .length * service.price
  }));

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(thisWeek.start);
    date.setDate(date.getDate() + i);
    const dayAppointments = appointments.filter(apt => 
      apt.date === format(date, 'yyyy-MM-dd') && apt.status !== 'cancelled'
    ).length;
    
    return {
      day: format(date, 'EEE', { locale: es }),
      appointments: dayAppointments
    };
  });

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const stats = [
    {
      title: 'Turnos Hoy',
      value: todayAppointments,
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Turnos Esta Semana',
      value: weeklyAppointments,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Turnos Este Mes',
      value: monthlyAppointments,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      title: 'Ingresos Totales',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100'
    }
  ];

  const quickActions = [
    {
      title: 'Ver Turnos',
      description: 'Gestionar reservas del día',
      icon: Calendar,
      link: '/admin/appointments',
      color: 'text-blue-600',
      bg: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      title: 'Gestionar Servicios',
      description: 'Agregar o editar servicios',
      icon: Settings,
      link: '/admin/services',
      color: 'text-green-600',
      bg: 'bg-green-50 hover:bg-green-100'
    },
    {
      title: 'Configurar Horarios',
      description: 'Establecer disponibilidad',
      icon: Clock,
      link: '/admin/schedule',
      color: 'text-purple-600',
      bg: 'bg-purple-50 hover:bg-purple-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-2">Resumen de tu negocio</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Acciones Rápidas */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className={`p-4 rounded-lg border border-gray-200 transition-colors ${action.bg}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center`}>
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Turnos por día de la semana */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Turnos Esta Semana</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="appointments" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Servicios más populares */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Servicios Más Populares</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="appointments"
              >
                {serviceStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Próximos turnos */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximos Turnos de Hoy</h2>
        <div className="space-y-3">
          {appointments
            .filter(apt => apt.date === format(today, 'yyyy-MM-dd') && apt.status === 'confirmed')
            .sort((a, b) => a.time.localeCompare(b.time))
            .slice(0, 5)
            .map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">{appointment.clientName}</p>
                    <p className="text-sm text-gray-600">{appointment.serviceName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{appointment.time}</p>
                  <p className="text-sm text-gray-600">Confirmado</p>
                </div>
              </div>
            ))}
          {appointments.filter(apt => apt.date === format(today, 'yyyy-MM-dd') && apt.status === 'confirmed').length === 0 && (
            <p className="text-center text-gray-500 py-4">No hay turnos confirmados para hoy</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;