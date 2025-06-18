
-- Create issues table for comprehensive issue reporting
CREATE TABLE public.issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('pothole', 'traffic_signal', 'streetlight', 'road_damage', 'other')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'acknowledged', 'in_progress', 'resolved', 'closed')),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_url TEXT,
  reported_by UUID REFERENCES auth.users(id) NOT NULL,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for issues
CREATE POLICY "Anyone can view issues" ON public.issues
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create issues" ON public.issues
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Users can update their own issues or admins can update any" ON public.issues
  FOR UPDATE TO authenticated USING (
    auth.uid() = reported_by OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamp
CREATE TRIGGER update_issues_updated_at
  BEFORE UPDATE ON public.issues
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Insert some sample issues for testing
INSERT INTO public.issues (title, description, category, priority, status, latitude, longitude, reported_by) VALUES
  ('Large pothole on Main Street', 'Deep pothole causing vehicle damage near intersection', 'pothole', 'high', 'reported', 40.7128, -74.0060, 'b7392dd9-007b-4148-afc4-592b411fef5a'),
  ('Traffic light malfunction', 'Traffic light stuck on red at Oak Avenue', 'traffic_signal', 'urgent', 'acknowledged', 40.7589, -73.9851, 'b7392dd9-007b-4148-afc4-592b411fef5a'),
  ('Street light out', 'Street light not working on Elm Street', 'streetlight', 'medium', 'in_progress', 40.7580, -73.9855, 'b7392dd9-007b-4148-afc4-592b411fef5a');
