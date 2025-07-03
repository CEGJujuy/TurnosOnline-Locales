import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Service {
  id: string;
  name: string;
  duration: number; // en minutos
  price: number;
  description: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

interface AppointmentContextType {
  services: Service[];
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  cancelAppointment: (id: string) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};

const defaultServices: Service[] = [
  {
    id: '1',
    name: 'Corte de Cabello',
    duration: 30,
    price: 2500,
    description: 'Corte personalizado según tu estilo'
  },
  {
    id: '2',
    name: 'Coloración',
    duration: 90,
    price: 8000,
    description: 'Coloración completa con productos premium'
  },
  {
    id: '3',
    name: 'Limpieza Facial',
    duration: 60,
    price: 4500,
    description: 'Limpieza profunda y tratamiento facial'
  },
  {
    id: '4',
    name: 'Manicura',
    duration: 45,
    price: 3000,
    description: 'Cuidado completo de uñas'
  }
];

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Cargar datos desde localStorage
    const savedServices = localStorage.getItem('services');
    const savedAppointments = localStorage.getItem('appointments');
    
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }
    
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString()
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const cancelAppointment = (id: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === id ? { ...apt, status: 'cancelled' } : apt
      )
    );
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === id ? { ...apt, ...updates } : apt
      )
    );
  };

  const addService = (service: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...service,
      id: Date.now().toString()
    };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => 
      prev.map(service => 
        service.id === id ? { ...service, ...updates } : service
      )
    );
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  return (
    <AppointmentContext.Provider value={{
      services,
      appointments,
      addAppointment,
      cancelAppointment,
      updateAppointment,
      addService,
      updateService,
      deleteService
    }}>
      {children}
    </AppointmentContext.Provider>
  );
};