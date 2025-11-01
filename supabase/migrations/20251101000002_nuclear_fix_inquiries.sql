-- ============================================================================
-- NUCLEAR FIX: Completely disable and recreate inquiries RLS
-- This is the most aggressive fix possible
-- ============================================================================

-- STEP 1: Disable RLS entirely first
ALTER TABLE public.inquiries DISABLE ROW LEVEL SECURITY;

-- STEP 2: Drop ALL policies (even if they don't exist)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'inquiries')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.inquiries';
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
END $$;

-- STEP 3: Revoke all permissions and re-grant from scratch
REVOKE ALL ON public.inquiries FROM anon, authenticated, public;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.inquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.inquiries TO authenticated;

-- STEP 4: Re-enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- STEP 5: Create ONLY the insert policy (simplest possible)
CREATE POLICY "inquiries_insert_policy"
ON public.inquiries
FOR INSERT
WITH CHECK (true);

-- STEP 6: Create admin policies
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

-- STEP 7: Verify
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count FROM pg_policies WHERE schemaname = 'public' AND tablename = 'inquiries';
  RAISE NOTICE '✅ Nuclear fix complete!';
  RAISE NOTICE '📊 Total policies on inquiries table: %', policy_count;
  RAISE NOTICE '🎯 Test your /contact form now!';
END $$;
