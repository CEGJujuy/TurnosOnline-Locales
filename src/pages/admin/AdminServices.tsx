import React, { useState } from 'react';
import { Plus, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { useAppointments, Service } from '../../contexts/AppointmentContext';
import toast from 'react-hot-toast';

const AdminServices: React.FC = () => {
  const { services, addService, updateService, deleteService } = useAppointments();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    duration: 30,
    price: 0,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || formData.price <= 0) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (editingService) {
      updateService(editingService.id, formData);
      toast.success('Servicio actualizado');
    } else {
      addService(formData);
      toast.success('Servicio agregado');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      duration: 30,
      price: 0,
      description: ''
    });
    setEditingService(null);
    setShowForm(false);
  };

  const handleEdit = (service: Service) => {
    setFormData({
      name: service.name,
      duration: service.duration,
      price: service.price,
      description: service.description
    });
    setEditingService(service);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      deleteService(id);
      toast.success('Servicio eliminado');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Servicios</h1>
          <p className="text-gray-600 mt-2">Administra los servicios que ofreces</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Agregar Servicio</span>
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Servicio
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                  placeholder="Ej: Corte de cabello"
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Precio ($)
                </label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="input-field"
                  required
                  min="0"
                  step="100"
                  placeholder="2500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duración (minutos)
              </label>
              <select
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                className="input-field"
              >
                <option value={15}>15 minutos</option>
                <option value={30}>30 minutos</option>
                <option value={45}>45 minutos</option>
                <option value={60}>1 hora</option>
                <option value={90}>1.5 horas</option>
                <option value={120}>2 horas</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field h-24 resize-none"
                required
                placeholder="Describe el servicio que ofreces..."
              />
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                {editingService ? 'Actualizar' : 'Agregar'} Servicio
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de servicios */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="card">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(service)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">{service.description}</p>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-1 text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{service.duration} min</span>
              </div>
              <div className="flex items-center space-x-1 text-primary-600 font-medium">
                <DollarSign className="h-4 w-4" />
                <span>{service.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">No hay servicios</h2>
          <p className="text-gray-600 mb-6">Agrega tu primer servicio para comenzar</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Agregar Servicio
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminServices;