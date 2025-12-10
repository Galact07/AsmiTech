-- Create company_info table
CREATE TABLE public.company_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  netherlands_address TEXT NOT NULL,
  india_address TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email_address TEXT NOT NULL,
  linkedin_url TEXT NOT NULL,
  other_social_links JSONB DEFAULT '[]'::jsonb,
  copyright_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add constraint to ensure only one row exists
-- We'll use a unique constraint on a constant value
CREATE UNIQUE INDEX company_info_single_row ON public.company_info ((1));

-- Enable RLS on company_info
ALTER TABLE public.company_info ENABLE ROW LEVEL SECURITY;

-- Company info policies
-- Anyone can view company info
CREATE POLICY "Anyone can view company info" ON public.company_info
  FOR SELECT USING (true);

-- Admins can manage company info
CREATE POLICY "Admins can manage company info" ON public.company_info
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_company_info_updated_at
  BEFORE UPDATE ON public.company_info
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

