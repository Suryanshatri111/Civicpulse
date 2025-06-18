
-- Create profiles table for additional user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create potholes table
CREATE TABLE public.potholes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'reported' CHECK (status IN ('reported', 'in_progress', 'resolved')),
  reported_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create traffic_signals table
CREATE TABLE public.traffic_signals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status TEXT DEFAULT 'online' CHECK (status IN ('online', 'offline', 'maintenance')),
  last_maintenance DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create government_projects table
CREATE TABLE public.government_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  budget DECIMAL(12, 2),
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
  location TEXT,
  contractor TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.potholes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for potholes
CREATE POLICY "Anyone can view potholes" ON public.potholes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create potholes" ON public.potholes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Users can update their own potholes" ON public.potholes
  FOR UPDATE TO authenticated USING (auth.uid() = reported_by);

-- Create RLS policies for traffic signals (admin only for modifications)
CREATE POLICY "Anyone can view traffic signals" ON public.traffic_signals
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can modify traffic signals" ON public.traffic_signals
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for government projects
CREATE POLICY "Anyone can view government projects" ON public.government_projects
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can modify government projects" ON public.government_projects
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample data
INSERT INTO public.traffic_signals (location, latitude, longitude, status) VALUES
  ('Main St & Oak Ave', 40.7128, -74.0060, 'online'),
  ('First St & Second Ave', 40.7589, -73.9851, 'maintenance'),
  ('Broadway & 42nd St', 40.7580, -73.9855, 'online');

INSERT INTO public.government_projects (title, description, budget, status, location) VALUES
  ('Road Resurfacing Project', 'Complete resurfacing of downtown roads', 2500000.00, 'in_progress', 'Downtown District'),
  ('Bridge Renovation', 'Structural improvements to Main Street Bridge', 1800000.00, 'planned', 'Main Street Bridge'),
  ('Traffic Light Modernization', 'Upgrade all traffic lights to LED systems', 950000.00, 'completed', 'City-wide');
