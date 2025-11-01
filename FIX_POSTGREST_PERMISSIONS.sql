-- ============================================================================
-- FIX POSTGREST API PERMISSIONS
-- The database works, but the REST API doesn't - this fixes it
-- ============================================================================

-- CRITICAL: Grant permissions to the anon role for PostgREST
-- PostgREST requires explicit grants on the schema and table

-- Step 1: Grant schema permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 2: Grant table permissions (must be explicit for PostgREST)
GRANT INSERT ON public.inquiries TO anon;
GRANT ALL ON public.inquiries TO authenticated;

-- Step 3: Grant permissions on the default value functions
-- UUID generation function
GRANT EXECUTE ON FUNCTION gen_random_uuid() TO anon, authenticated;

-- Step 4: Ensure the table owner allows anon access
-- Sometimes the table owner matters for PostgREST
ALTER TABLE public.inquiries OWNER TO postgres;

-- Step 5: Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- Step 6: Verify grants
SELECT 
  'Verification:' as status,
  grantee, 
  privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public' 
  AND table_name = 'inquiries'
  AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;

-- Step 7: Check if anon can access via PostgREST
-- This checks the role_privileges
SELECT 
  'Role Check:' as status,
  rolname,
  rolsuper,
  rolinherit,
  rolcreaterole,
  rolcreatedb,
  rolcanlogin
FROM pg_roles
WHERE rolname IN ('anon', 'authenticated', 'postgres');
