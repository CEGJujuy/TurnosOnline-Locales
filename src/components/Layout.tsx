import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, User, LogOut, Settings, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">TurnosOnline</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/') ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    <span>Inicio</span>
                  </Link>

                  {user.role === 'client' && (
                    <>
                      <Link
                        to="/book"
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                          isActive('/book') ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Calendar className="h-4 w-4" />
                        <span>Reservar</span>
                      </Link>
                      <Link
                        to="/my-appointments"
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                          isActive('/my-appointments') ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <User className="h-4 w-4" />
                        <span>Mis Turnos</span>
                      </Link>
                    </>
                  )}

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                        location.pathname.startsWith('/admin') ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  )}

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Hola, {user.name}</span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Salir</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;