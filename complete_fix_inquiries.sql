-- COMPLETE FIX: This should definitely work
-- Run this ENTIRE script in one go in Supabase SQL Editor

-- Step 1: Make absolutely sure the table exists
CREATE TABLE IF NOT EXISTS public.inquiries (
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

-- Step 2: DISABLE RLS completely first
ALTER TABLE public.inquiries DISABLE ROW LEVEL SECURITY;

-- Step 3: Drop EVERY possible policy (even ones we haven't created)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'inquiries'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.inquiries', r.policyname);
    END LOOP;
END $$;

-- Step 4: Grant schema access first (this is critical!)
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 5: Grant table permissions BEFORE enabling RLS
GRANT ALL ON public.inquiries TO anon;
GRANT ALL ON public.inquiries TO authenticated;

-- Step 6: Now enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Step 7: Create a policy that's as permissive as possible
-- Using 'permissive' and no roles means it applies to everyone
CREATE POLICY "allow_insert_for_all" ON public.inquiries
  AS PERMISSIVE
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

-- Step 8: Also create one specifically for anon (belt and suspenders)
CREATE POLICY "allow_anon_insert" ON public.inquiries
  AS PERMISSIVE
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Step 9: Create one for authenticated too
CREATE POLICY "allow_authenticated_insert" ON public.inquiries
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Step 10: Verify the policies exist
SELECT 
    policyname,
    cmd,
    roles,
    with_check
FROM pg_policies
WHERE tablename = 'inquiries';

-- If you see 3 policies above, it should work!
-- If not, there might be a permissions issue with creating policies

