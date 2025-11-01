-- ============================================================================
-- FINAL DEFINITIVE FIX - Run this in Supabase SQL Editor
-- This fixes the 401 error for anonymous contact form submissions
-- ============================================================================

-- Step 1: Check current grants (for debugging)
SELECT 
  grantee, 
  privilege_type,
  is_grantable
FROM information_schema.table_privileges
WHERE table_schema = 'public' 
  AND table_name = 'inquiries'
  AND grantee IN ('anon', 'authenticated', 'postgres')
ORDER BY grantee, privilege_type;

-- Step 2: Grant USAGE on schema (CRITICAL!)
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Step 3: Grant INSERT permission explicitly to anon
GRANT INSERT ON TABLE public.inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.inquiries TO authenticated;

-- Step 4: Verify the grant worked
SELECT 
  '✅ Grants applied' as status,
  grantee, 
  privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public' 
  AND table_name = 'inquiries'
  AND grantee = 'anon';

-- Step 5: Verify policies exist
SELECT 
  '✅ Policies verified' as status,
  policyname,
  cmd,
  roles::text
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'inquiries'
ORDER BY policyname;
