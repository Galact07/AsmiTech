-- ============================================================================
-- DEBUG AND FIX: Check table structure and fix RLS completely
-- ============================================================================

-- STEP 1: Check table structure
DO $$
DECLARE
  col_info RECORD;
BEGIN
  RAISE NOTICE '=== INQUIRIES TABLE STRUCTURE ===';
  FOR col_info IN 
    SELECT column_name, data_type, column_default, is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'inquiries'
    ORDER BY ordinal_position
  LOOP
    RAISE NOTICE 'Column: % | Type: % | Default: % | Nullable: %', 
      col_info.column_name, col_info.data_type, col_info.column_default, col_info.is_nullable;
  END LOOP;
END $$;

-- STEP 2: Check current policies
DO $$
DECLARE
  pol_info RECORD;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== CURRENT POLICIES ===';
  FOR pol_info IN 
    SELECT policyname, cmd, roles::text, qual, with_check
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'inquiries'
  LOOP
    RAISE NOTICE 'Policy: % | Command: % | Roles: %', pol_info.policyname, pol_info.cmd, pol_info.roles;
  END LOOP;
END $$;

-- STEP 3: Check grants
DO $$
DECLARE
  grant_info RECORD;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== CURRENT GRANTS ===';
  FOR grant_info IN 
    SELECT grantee, privilege_type
    FROM information_schema.table_privileges
    WHERE table_schema = 'public' AND table_name = 'inquiries'
    ORDER BY grantee, privilege_type
  LOOP
    RAISE NOTICE 'Grantee: % | Privilege: %', grant_info.grantee, grant_info.privilege_type;
  END LOOP;
END $$;

-- STEP 4: THE ACTUAL FIX - Temporarily disable RLS to test
-- UNCOMMENT THE NEXT LINE TO DISABLE RLS COMPLETELY (for testing only)
-- ALTER TABLE public.inquiries DISABLE ROW LEVEL SECURITY;

-- STEP 5: Or apply the proper fix
-- Drop all policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'inquiries')
    LOOP
        EXECUTE 'DROP POLICY "' || r.policyname || '" ON public.inquiries';
    END LOOP;
END $$;

-- Ensure RLS is enabled
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Grant permissions explicitly
GRANT INSERT ON public.inquiries TO anon;
GRANT SELECT, UPDATE, DELETE ON public.inquiries TO authenticated;

-- Create the simplest possible INSERT policy
CREATE POLICY "inquiries_anon_insert"
ON public.inquiries
FOR INSERT
TO anon
WITH CHECK (true);

-- Create authenticated INSERT policy too
CREATE POLICY "inquiries_auth_insert"
ON public.inquiries
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Admin SELECT policy
CREATE POLICY "inquiries_admin_select"
ON public.inquiries
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Admin UPDATE policy
CREATE POLICY "inquiries_admin_update"
ON public.inquiries
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Admin DELETE policy
CREATE POLICY "inquiries_admin_delete"
ON public.inquiries
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Final verification
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ FIX APPLIED!';
  RAISE NOTICE 'Created separate INSERT policies for anon and authenticated';
  RAISE NOTICE 'Both have WITH CHECK (true) - no restrictions';
END $$;
