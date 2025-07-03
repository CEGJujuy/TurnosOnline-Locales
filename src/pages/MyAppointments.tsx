import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, DollarSign, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAppointments } from '../contexts/AppointmentContext';
import toast from 'react-hot-toast';

const MyAppointments: React.FC = () => {
  const { user } = useAuth();
  const { appointments, cancelAppointment } = useAppointments();

  if (!user) return null;

  const myAppointments = appointments
    .filter(apt => apt.clientId === user.id)
    .sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());

  const handleCancel = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar este turno?')) {
      cancelAppointment(id);
      toast.success('Turno cancelado');
    }
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mis Turnos</h1>
        <p className="text-gray-600 mt-2">Gestiona tus reservas</p>
      </div>

      {myAppointments.length === 0 ? (
        <div className="card text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">No tienes turnos reservados</h2>
          <p className="text-gray-600 mb-6">¡Reserva tu primer turno ahora!</p>
          <a href="/book" className="btn-primary">
            Reservar Turno
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {myAppointments.map((appointment) => (
            <div key={appointment.id} className="card">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {appointment.serviceName}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(appointment.date), 'dd/MM/yyyy', { locale: es })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span>Precio según servicio</span>
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

                {appointment.status === 'confirmed' && (
                  <div className="mt-4 md:mt-0 md:ml-4">
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancelar</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;