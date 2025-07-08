import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import { format, addDays, isAfter, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAppointments } from '../contexts/AppointmentContext';
import toast from 'react-hot-toast';

const BookAppointment: React.FC = () => {
  const { user } = useAuth();
  const { services, appointments, addAppointment } = useAppointments();
  const navigate = useNavigate();
  
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  const getAvailableTimeSlots = () => {
    if (!selectedDate) return timeSlots;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const bookedTimes = appointments
      .filter(apt => apt.date === dateStr && apt.status !== 'cancelled')
      .map(apt => apt.time);
    
    return timeSlots.filter(time => !bookedTimes.includes(time));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const service = services.find(s => s.id === selectedService);
    if (!service) return;

    const appointment = {
      clientId: user.id,
      clientName: user.name,
      clientEmail: user.email,
      serviceId: service.id,
      serviceName: service.name,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      status: 'confirmed' as const,
      notes
    };

    addAppointment(appointment);
    toast.success('¡Turno reservado exitosamente!');
    navigate('/my-appointments');
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reservar Turno</h1>
        <p className="text-gray-600 mt-2">Selecciona tu servicio, fecha y horario preferido</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Selección de Servicio */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Selecciona tu servicio</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedService === service.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedService(service.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                  <div className="flex items-center text-primary-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">{service.price}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{service.duration} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selección de Fecha */}
        {selectedService && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Selecciona la fecha</h2>
            <div className="max-w-md mx-auto">
              <Calendar
                onChange={(date) => setSelectedDate(date as Date)}
                value={selectedDate}
                minDate={new Date()}
                maxDate={addDays(new Date(), 30)}
                locale="es"
                tileDisabled={({ date }) => {
                  const day = date.getDay();
                  return day === 0; // Deshabilitar domingos
                }}
              />
            </div>
          </div>
        )}

        {/* Selección de Hora */}
        {selectedDate && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              3. Selecciona la hora para {format(selectedDate, 'dd/MM/yyyy', { locale: es })}
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {getAvailableTimeSlots().map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 text-center rounded-lg border transition-colors ${
                    selectedTime === time
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            {getAvailableTimeSlots().length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No hay horarios disponibles para esta fecha
              </p>
            )}
          </div>
        )}

        {/* Notas adicionales */}
        {selectedTime && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Notas adicionales (opcional)</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field h-24 resize-none"
              placeholder="Alguna preferencia o comentario especial..."
            />
          </div>
        )}

        {/* Resumen y Confirmación */}
        {selectedTime && (
          <div className="card bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen de tu reserva</h2>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Servicio:</span>
                <span className="font-medium">{selectedServiceData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="font-medium">
                  {selectedDate && format(selectedDate, 'dd/MM/yyyy', { locale: es })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hora:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duración:</span>
                <span className="font-medium">{selectedServiceData?.duration} min</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary-600">${selectedServiceData?.price}</span>
              </div>
            </div>
            
            <button type="submit" className="w-full btn-primary text-lg py-3">
              Confirmar Reserva
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default BookAppointment;