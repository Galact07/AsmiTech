-- Fix RLS policy for inquiries table to allow anonymous inserts
-- This ensures the contact form can be submitted from any device without authentication

-- First, check if table exists and create it if not
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'inquiries'
  ) THEN
    CREATE TABLE public.inquiries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in-progress', 'resolved', 'closed')),
      submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END $$;

-- Enable RLS on inquiries
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can create inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can manage inquiries" ON public.inquiries;

-- Create policy to allow anyone to insert inquiries (for contact form)
-- This is the critical policy that makes the contact form work!
CREATE POLICY "Anyone can create inquiries" ON public.inquiries
  FOR INSERT 
  WITH CHECK (true);

-- Note: Admin policy is skipped here because profiles table doesn't exist yet
-- You can add the admin policy later when you set up the profiles table
-- For now, the contact form will work because anonymous users can INSERT

-- Grant necessary permissions
GRANT INSERT ON public.inquiries TO anon;
GRANT INSERT ON public.inquiries TO authenticated;
GRANT SELECT ON public.inquiries TO authenticated;

-- Ensure submitted_at column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'inquiries' 
    AND column_name = 'submitted_at'
  ) THEN
    ALTER TABLE public.inquiries ADD COLUMN submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Create or replace function for updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_inquiries_updated_at ON public.inquiries;
CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
