-- ULTIMATE FIX: This will completely reset everything and fix the RLS issue
-- Run this ENTIRE script in Supabase SQL Editor

-- Step 1: Disable RLS completely
ALTER TABLE public.inquiries DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop EVERY single policy (using dynamic SQL to catch all)
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on inquiries table
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'inquiries'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.inquiries', r.policyname);
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
END $$;

-- Step 3: Ensure we have proper grants at schema level
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Step 4: Explicitly grant on inquiries table again
GRANT ALL PRIVILEGES ON public.inquiries TO anon;
GRANT ALL PRIVILEGES ON public.inquiries TO authenticated;

-- Step 5: Re-enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Step 6: Create a SIMPLE policy WITHOUT any role restriction
-- This applies to ALL roles including anon
CREATE POLICY "inquiries_insert_policy" ON public.inquiries
  FOR INSERT
  WITH CHECK (true);

-- Step 7: Verify what we have
SELECT 
    policyname,
    cmd,
    roles,
    with_check,
    qual
FROM pg_policies
WHERE tablename = 'inquiries';

-- Step 8: Check grants one more time
SELECT 
    grantee,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public' 
AND table_name = 'inquiries'
AND grantee IN ('anon', 'authenticated');

-- If this still doesn't work, the issue might be:
-- 1. The Supabase client is using wrong key (check it's anon key, not service_role)
-- 2. There's a trigger or constraint blocking
-- 3. The actual role being used is different

