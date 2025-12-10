-- Create client_logos table
CREATE TABLE public.client_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  logo_image_url TEXT,
  logo_file_name TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  website_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on client_logos
ALTER TABLE public.client_logos ENABLE ROW LEVEL SECURITY;

-- Client logos policies
-- Anyone can view active client logos
CREATE POLICY "Anyone can view active client logos" ON public.client_logos
  FOR SELECT USING (is_active = true);

-- Admins can view all client logos
CREATE POLICY "Admins can view all client logos" ON public.client_logos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can manage client logos
CREATE POLICY "Admins can manage client logos" ON public.client_logos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_client_logos_updated_at
  BEFORE UPDATE ON public.client_logos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for client logos
INSERT INTO storage.buckets (id, name, public, file_size_limit) 
VALUES 
  ('client-logos', 'client-logos', true, 5242880) -- 5MB limit
ON CONFLICT (id) DO NOTHING;

-- Storage policies for client logos
-- Anyone can view client logos
CREATE POLICY "Anyone can view client logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'client-logos');

-- Admins can upload client logos
CREATE POLICY "Admins can upload client logos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'client-logos' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update client logos
CREATE POLICY "Admins can update client logos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'client-logos' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can delete client logos
CREATE POLICY "Admins can delete client logos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'client-logos' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

