-- ============================================================================
-- COMPLETE POSTGREST FIX
-- Database works, but REST API fails - this is a PostgREST permission issue
-- ============================================================================

-- Step 1: Ensure anon role exists and has correct attributes
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
    RAISE NOTICE 'Created anon role';
  END IF;
END $$;

-- Step 2: Grant schema usage (required for PostgREST)
GRANT USAGE ON SCHEMA public TO anon;

-- Step 3: Revoke ALL first, then grant INSERT (clean slate)
REVOKE ALL ON public.inquiries FROM anon;
GRANT INSERT ON public.inquiries TO anon;

-- Step 4: Grant on sequences (for default values)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Step 5: Ensure RLS policies are correct
-- Drop and recreate the anon INSERT policy
DROP POLICY IF EXISTS "inquiries_insert_for_anon" ON public.inquiries;

CREATE POLICY "inquiries_insert_for_anon"
ON public.inquiries
AS PERMISSIVE
FOR INSERT
TO anon
WITH CHECK (true);

-- Step 6: CRITICAL - Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- Step 7: Verify everything
DO $$
DECLARE
  has_grant BOOLEAN;
  has_policy BOOLEAN;
BEGIN
  -- Check grant
  SELECT EXISTS (
    SELECT 1 FROM information_schema.table_privileges
    WHERE table_schema = 'public' 
      AND table_name = 'inquiries'
      AND grantee = 'anon'
      AND privilege_type = 'INSERT'
  ) INTO has_grant;
  
  -- Check policy
  SELECT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' 
      AND tablename = 'inquiries'
      AND policyname = 'inquiries_insert_for_anon'
  ) INTO has_policy;
  
  IF has_grant AND has_policy THEN
    RAISE NOTICE '✅ All permissions configured correctly';
    RAISE NOTICE '🔄 PostgREST reload signal sent';
    RAISE NOTICE '⏳ Wait 10-15 seconds for PostgREST to reload';
    RAISE NOTICE '🌐 Then try your contact form again';
  ELSE
    IF NOT has_grant THEN
      RAISE WARNING '❌ anon role does NOT have INSERT grant!';
    END IF;
    IF NOT has_policy THEN
      RAISE WARNING '❌ anon INSERT policy does NOT exist!';
    END IF;
  END IF;
END $$;

-- Final verification query
SELECT 
  'FINAL STATE:' as status,
  grantee, 
  privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public' 
  AND table_name = 'inquiries'
  AND grantee = 'anon';
