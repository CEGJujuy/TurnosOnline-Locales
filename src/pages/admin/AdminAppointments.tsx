import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle, Edit } from 'lucide-react';
import { useAppointments } from '../../contexts/AppointmentContext';
import toast from 'react-hot-toast';

const AdminAppointments: React.FC = () => {
  const { appointments, updateAppointment, cancelAppointment } = useAppointments();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAppointments = appointments
    .filter(apt => {
      if (selectedDate && apt.date !== selectedDate) return false;
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  const handleStatusChange = (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    updateAppointment(id, { status });
    toast.success(`Turno ${status === 'completed' ? 'completado' : status === 'cancelled' ? 'cancelado' : 'confirmado'}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'cancelled':
        return 'Cancelado';
      case 'completed':
        return 'Completado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Turnos</h1>
          <p className="text-gray-600 mt-2">Administra las reservas de tus clientes</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">Todos</option>
              <option value="confirmed">Confirmados</option>
              <option value="completed">Completados</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de turnos */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="card text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">No hay turnos</h2>
            <p className="text-gray-600">No se encontraron turnos para los filtros seleccionados</p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="card">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {appointment.serviceName}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{appointment.clientName}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{appointment.clientEmail}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(appointment.date), 'dd/MM/yyyy', { locale: es })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Notas:</strong> {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex flex-wrap gap-2">
                  {appointment.status === 'confirmed' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(appointment.id, 'completed')}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Completar</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Cancelar</span>
                      </button>
                    </>
                  )}
                  
                  {appointment.status === 'cancelled' && (
                    <button
                      onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                      className="flex items-center space-x-1 text-green-600 hover:text-green-700 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Reactivar</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resumen del día */}
      {selectedDate && (
        <div className="card bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen del {format(new Date(selectedDate), 'dd/MM/yyyy', { locale: es })}
          </h2>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {filteredAppointments.filter(apt => apt.status === 'confirmed').length}
              </p>
              <p className="text-sm text-gray-600">Confirmados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {filteredAppointments.filter(apt => apt.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Completados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {filteredAppointments.filter(apt => apt.status === 'cancelled').length}
              </p>
              <p className="text-sm text-gray-600">Cancelados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {filteredAppointments.length}
              </p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;