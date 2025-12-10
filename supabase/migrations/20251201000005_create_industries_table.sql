-- Create industries table
CREATE TABLE public.industries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  hero_image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  content_sections JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on industries
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;

-- Industries policies
-- Anyone can view active industries
CREATE POLICY "Anyone can view active industries" ON public.industries
  FOR SELECT USING (is_active = true);

-- Admins can view all industries
CREATE POLICY "Admins can view all industries" ON public.industries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can manage industries
CREATE POLICY "Admins can manage industries" ON public.industries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_industries_updated_at
  BEFORE UPDATE ON public.industries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for industry images
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES
  ('industry-images', 'industry-images', true, 5242880) -- 5MB limit
ON CONFLICT (id) DO NOTHING;

-- Storage policies for industry images
CREATE POLICY "Anyone can view industry images" ON storage.objects
  FOR SELECT USING (bucket_id = 'industry-images');

CREATE POLICY "Admins can upload industry images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'industry-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update industry images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'industry-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete industry images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'industry-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

