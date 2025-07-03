import React, { useState } from 'react';
import { Clock, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ScheduleDay {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
}

const AdminSchedule: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleDay[]>([
    { day: 'Lunes', enabled: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Martes', enabled: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Miércoles', enabled: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Jueves', enabled: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Viernes', enabled: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Sábado', enabled: true, startTime: '09:00', endTime: '16:00', breakStart: '', breakEnd: '' },
    { day: 'Domingo', enabled: false, startTime: '09:00', endTime: '18:00', breakStart: '', breakEnd: '' }
  ]);

  const [specialDates, setSpecialDates] = useState<Array<{ date: string; reason: string }>>([]);
  const [newSpecialDate, setNewSpecialDate] = useState({ date: '', reason: '' });

  const updateScheduleDay = (index: number, field: keyof ScheduleDay, value: string | boolean) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setSchedule(newSchedule);
  };

  const handleSaveSchedule = () => {
    // Aquí se guardaría en la base de datos
    localStorage.setItem('businessSchedule', JSON.stringify(schedule));
    toast.success('Horarios guardados correctamente');
  };

  const addSpecialDate = () => {
    if (!newSpecialDate.date || !newSpecialDate.reason) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setSpecialDates([...specialDates, newSpecialDate]);
    setNewSpecialDate({ date: '', reason: '' });
    toast.success('Fecha especial agregada');
  };

  const removeSpecialDate = (index: number) => {
    setSpecialDates(specialDates.filter((_, i) => i !== index));
    toast.success('Fecha especial eliminada');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración de Horarios</h1>
          <p className="text-gray-600 mt-2">Establece tu disponibilidad semanal</p>
        </div>
        <button
          onClick={handleSaveSchedule}
          className="btn-primary flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>Guardar Cambios</span>
        </button>
      </div>

      {/* Horarios semanales */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Horarios de Atención</h2>
        <div className="space-y-4">
          {schedule.map((day, index) => (
            <div key={day.day} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={day.enabled}
                  onChange={(e) => updateScheduleDay(index, 'enabled', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="font-medium text-gray-900">{day.day}</span>
              </div>

              {day.enabled ? (
                <>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Apertura</label>
                    <input
                      type="time"
                      value={day.startTime}
                      onChange={(e) => updateScheduleDay(index, 'startTime', e.target.value)}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Cierre</label>
                    <input
                      type="time"
                      value={day.endTime}
                      onChange={(e) => updateScheduleDay(index, 'endTime', e.target.value)}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Descanso inicio</label>
                    <input
                      type="time"
                      value={day.breakStart}
                      onChange={(e) => updateScheduleDay(index, 'breakStart', e.target.value)}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Descanso fin</label>
                    <input
                      type="time"
                      value={day.breakEnd}
                      onChange={(e) => updateScheduleDay(index, 'breakEnd', e.target.value)}
                      className="input-field text-sm"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    {day.startTime} - {day.endTime}
                    {day.breakStart && day.breakEnd && (
                      <div className="text-xs">Descanso: {day.breakStart} - {day.breakEnd}</div>
                    )}
                  </div>
                </>
              ) : (
                <div className="md:col-span-5 text-sm text-gray-500">Cerrado</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fechas especiales */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Fechas Especiales</h2>
        <p className="text-gray-600 mb-4">Agrega días feriados o fechas en las que no atenderás</p>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="specialDate" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              id="specialDate"
              value={newSpecialDate.date}
              onChange={(e) => setNewSpecialDate({ ...newSpecialDate, date: e.target.value })}
              className="input-field"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label htmlFor="specialReason" className="block text-sm font-medium text-gray-700 mb-1">
              Motivo
            </label>
            <input
              type="text"
              id="specialReason"
              value={newSpecialDate.reason}
              onChange={(e) => setNewSpecialDate({ ...newSpecialDate, reason: e.target.value })}
              className="input-field"
              placeholder="Ej: Feriado nacional"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={addSpecialDate}
              className="btn-primary w-full"
            >
              Agregar
            </button>
          </div>
        </div>

        {specialDates.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Fechas programadas:</h3>
            {specialDates.map((special, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">
                    <strong>{special.date}</strong> - {special.reason}
                  </span>
                </div>
                <button
                  onClick={() => removeSpecialDate(index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Configuración adicional */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración Adicional</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Reservas con anticipación</h3>
              <p className="text-sm text-gray-600">Tiempo mínimo para reservar un turno</p>
            </div>
            <select className="input-field w-auto">
              <option value="0">Inmediato</option>
              <option value="1">1 hora</option>
              <option value="2">2 horas</option>
              <option value="24">24 horas</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Máximo días para reservar</h3>
              <p className="text-sm text-gray-600">Hasta cuántos días en el futuro se puede reservar</p>
            </div>
            <select className="input-field w-auto">
              <option value="7">7 días</option>
              <option value="15">15 días</option>
              <option value="30">30 días</option>
              <option value="60">60 días</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Intervalo entre turnos</h3>
              <p className="text-sm text-gray-600">Tiempo de separación entre citas</p>
            </div>
            <select className="input-field w-auto">
              <option value="0">Sin intervalo</option>
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSchedule;