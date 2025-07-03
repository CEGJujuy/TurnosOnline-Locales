/*
  # Sistema de Reservas de Turnos Online - Schema Inicial

  1. Nuevas Tablas
    - `profiles` - Perfiles de usuario (extiende auth.users)
      - `id` (uuid, referencia a auth.users)
      - `name` (text)
      - `role` (enum: client, admin)
      - `phone` (text, opcional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `services` - Servicios disponibles
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `duration` (integer, en minutos)
      - `price` (decimal)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `appointments` - Reservas de turnos
      - `id` (uuid, primary key)
      - `client_id` (uuid, referencia a profiles)
      - `service_id` (uuid, referencia a services)
      - `appointment_date` (date)
      - `appointment_time` (time)
      - `status` (enum: confirmed, cancelled, completed)
      - `notes` (text, opcional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `business_schedule` - Horarios de atención
      - `id` (uuid, primary key)
      - `day_of_week` (integer, 0-6)
      - `start_time` (time)
      - `end_time` (time)
      - `break_start` (time, opcional)
      - `break_end` (time, opcional)
      - `is_active` (boolean)
    
    - `special_dates` - Fechas especiales (feriados, cierres)
      - `id` (uuid, primary key)
      - `date` (date)
      - `reason` (text)
      - `is_closed` (boolean)

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para clientes (solo sus datos)
    - Políticas para administradores (acceso completo)
    - Políticas públicas para servicios activos
</sql>

-- Crear enum para roles
CREATE TYPE user_role AS ENUM ('client', 'admin');

-- Crear enum para estados de citas
CREATE TYPE appointment_status AS ENUM ('confirmed', 'cancelled', 'completed');

-- Tabla de perfiles (extiende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name text NOT NULL,
  role user_role DEFAULT 'client',
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de servicios
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  duration integer NOT NULL DEFAULT 30,
  price decimal(10,2) NOT NULL DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de citas/turnos
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status appointment_status DEFAULT 'confirmed',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(appointment_date, appointment_time, status) WHERE status != 'cancelled'
);

-- Tabla de horarios de negocio
CREATE TABLE IF NOT EXISTS business_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  break_start time,
  break_end time,
  is_active boolean DEFAULT true,
  UNIQUE(day_of_week)
);

-- Tabla de fechas especiales
CREATE TABLE IF NOT EXISTS special_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  reason text NOT NULL,
  is_closed boolean DEFAULT true
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_dates ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para services
CREATE POLICY "Anyone can read active services"
  ON services
  FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admins can manage services"
  ON services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para appointments
CREATE POLICY "Clients can read own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Clients can create appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Clients can update own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Admins can manage all appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para business_schedule
CREATE POLICY "Anyone can read business schedule"
  ON business_schedule
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage business schedule"
  ON business_schedule
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para special_dates
CREATE POLICY "Anyone can read special dates"
  ON special_dates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage special dates"
  ON special_dates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insertar servicios por defecto
INSERT INTO services (name, description, duration, price) VALUES
  ('Corte de Cabello', 'Corte personalizado según tu estilo', 30, 2500.00),
  ('Coloración', 'Coloración completa con productos premium', 90, 8000.00),
  ('Limpieza Facial', 'Limpieza profunda y tratamiento facial', 60, 4500.00),
  ('Manicura', 'Cuidado completo de uñas', 45, 3000.00),
  ('Pedicura', 'Tratamiento completo para pies', 60, 3500.00),
  ('Tratamiento Capilar', 'Hidratación y reparación del cabello', 45, 5000.00);

-- Insertar horarios de negocio por defecto (Lunes a Sábado)
INSERT INTO business_schedule (day_of_week, start_time, end_time, break_start, break_end) VALUES
  (1, '09:00', '18:00', '13:00', '14:00'), -- Lunes
  (2, '09:00', '18:00', '13:00', '14:00'), -- Martes
  (3, '09:00', '18:00', '13:00', '14:00'), -- Miércoles
  (4, '09:00', '18:00', '13:00', '14:00'), -- Jueves
  (5, '09:00', '18:00', '13:00', '14:00'), -- Viernes
  (6, '09:00', '16:00', NULL, NULL);       -- Sábado

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();