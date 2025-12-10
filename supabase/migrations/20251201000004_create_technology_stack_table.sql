-- Create technology_stack table
CREATE TABLE public.technology_stack (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_image_url TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  link_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on technology_stack
ALTER TABLE public.technology_stack ENABLE ROW LEVEL SECURITY;

-- Technology stack policies
-- Anyone can view active technologies
CREATE POLICY "Anyone can view active technologies" ON public.technology_stack
  FOR SELECT USING (is_active = true);

-- Admins can view all technologies
CREATE POLICY "Admins can view all technologies" ON public.technology_stack
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can manage technologies
CREATE POLICY "Admins can manage technologies" ON public.technology_stack
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_technology_stack_updated_at
  BEFORE UPDATE ON public.technology_stack
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for technology logos
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES
  ('technology-logos', 'technology-logos', true, 5242880) -- 5MB limit
ON CONFLICT (id) DO NOTHING;

-- Storage policies for technology logos
CREATE POLICY "Anyone can view technology logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'technology-logos');

CREATE POLICY "Admins can upload technology logos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'technology-logos' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update technology logos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'technology-logos' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete technology logos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'technology-logos' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

