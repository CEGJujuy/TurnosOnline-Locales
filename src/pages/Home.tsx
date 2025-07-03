import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Calendar,
      title: 'Reserva Fácil',
      description: 'Selecciona tu servicio, fecha y hora en pocos clics'
    },
    {
      icon: Clock,
      title: 'Disponibilidad 24/7',
      description: 'Reserva tus turnos cuando quieras, las 24 horas'
    },
    {
      icon: Users,
      title: 'Profesionales Expertos',
      description: 'Nuestro equipo está capacitado para brindarte el mejor servicio'
    },
    {
      icon: Star,
      title: 'Calidad Garantizada',
      description: 'Servicios de alta calidad con productos premium'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Reserva tu turno
          <span className="block text-primary-600">online</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Sistema moderno y fácil de usar para reservar tus servicios de belleza y cuidado personal
        </p>
        
        {user ? (
          user.role === 'client' ? (
            <Link to="/book" className="btn-primary text-lg px-8 py-3 inline-block">
              Reservar Turno
            </Link>
          ) : (
            <Link to="/admin" className="btn-primary text-lg px-8 py-3 inline-block">
              Panel de Administración
            </Link>
          )
        ) : (
          <div className="space-x-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-block">
              Comenzar
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3 inline-block">
              Iniciar Sesión
            </Link>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="card text-center space-y-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto">
              <feature.icon className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Services Preview */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Nuestros Servicios</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
              ✂️
            </div>
            <h3 className="font-medium">Corte de Cabello</h3>
            <p className="text-sm text-gray-600">Desde $2.500</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
              🎨
            </div>
            <h3 className="font-medium">Coloración</h3>
            <p className="text-sm text-gray-600">Desde $8.000</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
              ✨
            </div>
            <h3 className="font-medium">Limpieza Facial</h3>
            <p className="text-sm text-gray-600">Desde $4.500</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
              💅
            </div>
            <h3 className="font-medium">Manicura</h3>
            <p className="text-sm text-gray-600">Desde $3.000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;