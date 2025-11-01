-- ============================================================================
-- ABSOLUTE FINAL FIX - Run as postgres/service_role user
-- This MUST be run in Supabase SQL Editor (which uses service_role)
-- ============================================================================

-- STEP 1: Show current state
DO $$
BEGIN
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'STARTING FIX FOR INQUIRIES TABLE';
  RAISE NOTICE '==========================================';
END $$;

-- STEP 2: Ensure we're running as superuser
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_roles 
    WHERE rolname = current_user 
    AND rolsuper = true
  ) THEN
    RAISE NOTICE 'WARNING: Not running as superuser. Some grants may fail.';
  ELSE
    RAISE NOTICE '✓ Running as superuser: %', current_user;
  END IF;
END $$;

-- STEP 3: Grant schema usage (must come first)
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

-- STEP 4: Grant table permissions
-- Use ALTER DEFAULT PRIVILEGES to ensure future objects also get permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT INSERT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;

-- STEP 5: Grant on existing inquiries table
GRANT INSERT ON TABLE public.inquiries TO anon;
GRANT ALL ON TABLE public.inquiries TO authenticated;
GRANT ALL ON TABLE public.inquiries TO service_role;

-- STEP 6: Grant sequence permissions (for UUID generation)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- STEP 7: Ensure RLS is enabled
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- STEP 8: Drop all old policies
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'inquiries'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.inquiries', pol.policyname);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

-- STEP 9: Create simple, permissive policies
CREATE POLICY "inquiries_insert_for_anon"
ON public.inquiries
AS PERMISSIVE
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "inquiries_insert_for_authenticated"
ON public.inquiries
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "inquiries_select_for_admin"
ON public.inquiries
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "inquiries_update_for_admin"
ON public.inquiries
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "inquiries_delete_for_admin"
ON public.inquiries
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- STEP 10: Verify everything
DO $$
DECLARE
  grant_count INTEGER;
  policy_count INTEGER;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'VERIFICATION';
  RAISE NOTICE '==========================================';
  
  -- Check grants
  SELECT COUNT(*) INTO grant_count
  FROM information_schema.table_privileges
  WHERE table_schema = 'public' 
    AND table_name = 'inquiries'
    AND grantee = 'anon'
    AND privilege_type = 'INSERT';
  
  IF grant_count > 0 THEN
    RAISE NOTICE '✓ anon role has INSERT grant';
  ELSE
    RAISE WARNING '✗ anon role does NOT have INSERT grant!';
  END IF;
  
  -- Check policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public' 
    AND tablename = 'inquiries'
    AND policyname = 'inquiries_insert_for_anon';
  
  IF policy_count > 0 THEN
    RAISE NOTICE '✓ anon INSERT policy exists';
  ELSE
    RAISE WARNING '✗ anon INSERT policy does NOT exist!';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '==========================================';
  RAISE NOTICE '✅ FIX COMPLETE!';
  RAISE NOTICE '🎯 Test your contact form now';
  RAISE NOTICE '==========================================';
END $$;

-- STEP 11: Display final state
SELECT 
  'GRANTS:' as type,
  grantee, 
  privilege_type,
  is_grantable
FROM information_schema.table_privileges
WHERE table_schema = 'public' 
  AND table_name = 'inquiries'
  AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;

SELECT 
  'POLICIES:' as type,
  policyname,
  cmd as command,
  roles::text as applies_to,
  permissive as is_permissive
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'inquiries'
ORDER BY policyname;
