-- SIMPLE FIX: Run this in Supabase SQL Editor to fix the contact form
-- This script ensures anonymous users can insert into inquiries table

-- Step 1: Disable RLS temporarily
ALTER TABLE IF EXISTS public.inquiries DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies to start clean
DROP POLICY IF EXISTS "Anyone can create inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "allow_anonymous_inserts" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can manage inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Users can view own inquiries" ON public.inquiries;

-- Step 3: Re-enable RLS
ALTER TABLE IF EXISTS public.inquiries ENABLE ROW LEVEL SECURITY;

-- Step 4: Create the SIMPLEST possible INSERT policy
-- This policy allows ANYONE (anon or authenticated) to INSERT
-- Note: Omitting TO clause means it applies to all roles
CREATE POLICY "allow_all_inserts" ON public.inquiries
  FOR INSERT
  WITH CHECK (true);

-- Step 5: Grant permissions explicitly
GRANT INSERT ON public.inquiries TO anon;
GRANT INSERT ON public.inquiries TO authenticated;
GRANT SELECT ON public.inquiries TO anon;
GRANT SELECT ON public.inquiries TO authenticated;

-- Step 6: Verify - Run this query to check if policy exists:
-- SELECT * FROM pg_policies WHERE tablename = 'inquiries';

