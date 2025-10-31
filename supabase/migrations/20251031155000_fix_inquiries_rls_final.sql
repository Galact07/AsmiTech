-- Final fix for inquiries RLS policy - ensures contact form works
-- Run this in Supabase SQL Editor if the previous migration didn't work

-- First, ensure the table exists
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

-- Temporarily disable RLS to fix policies
ALTER TABLE public.inquiries DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on inquiries table to start fresh
DROP POLICY IF EXISTS "Anyone can create inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can manage inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Users can view own inquiries" ON public.inquiries;

-- Re-enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Create a very explicit INSERT policy that allows anyone (including anonymous users)
-- This uses both WITH CHECK (true) which is the key for allowing inserts
CREATE POLICY "allow_anonymous_inserts" ON public.inquiries
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Also create a policy using the old name for backwards compatibility
CREATE POLICY "Anyone can create inquiries" ON public.inquiries
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Grant explicit permissions to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON public.inquiries TO anon;
GRANT SELECT ON public.inquiries TO anon;
GRANT USAGE ON SEQUENCE IF EXISTS inquiries_id_seq TO anon;

-- Grant permissions to authenticated role
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT INSERT ON public.inquiries TO authenticated;
GRANT SELECT ON public.inquiries TO authenticated;
GRANT USAGE ON SEQUENCE IF EXISTS inquiries_id_seq TO authenticated;

-- Ensure columns exist
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
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'inquiries' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.inquiries ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Create trigger function if it doesn't exist
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

-- Create or replace trigger
DROP TRIGGER IF EXISTS update_inquiries_updated_at ON public.inquiries;
CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Verify the policies are set correctly
-- This query should show the policies after running the script
-- SELECT * FROM pg_policies WHERE tablename = 'inquiries';

