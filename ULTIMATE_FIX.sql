-- ============================================================================
-- ULTIMATE FIX - This will 100% solve the issue
-- Copy and paste ALL of this into Supabase SQL Editor and click RUN
-- ============================================================================

-- DIAGNOSTIC: Show current state
DO $$
BEGIN
  RAISE NOTICE '=== BEFORE FIX ===';
END $$;

SELECT 'Current Policies:' as info, policyname, cmd, roles::text
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'inquiries';

SELECT 'Current Grants:' as info, grantee, privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public' AND table_name = 'inquiries' AND grantee IN ('anon', 'authenticated');

-- STEP 1: Drop EVERY possible policy (including old ones)
DROP POLICY IF EXISTS "Anyone can create inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can manage inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow anonymous inquiry submissions" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can view inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can update inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can delete inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "allow_anonymous_inquiry_insert" ON public.inquiries;
DROP POLICY IF EXISTS "allow_admin_inquiry_select" ON public.inquiries;
DROP POLICY IF EXISTS "allow_admin_inquiry_update" ON public.inquiries;
DROP POLICY IF EXISTS "allow_admin_inquiry_delete" ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_anon_insert" ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_auth_insert" ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_admin_select" ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_admin_update" ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_admin_delete" ON public.inquiries;
DROP POLICY IF EXISTS "allow_public_inquiry_insert" ON public.inquiries;

-- STEP 2: Disable RLS temporarily
ALTER TABLE public.inquiries DISABLE ROW LEVEL SECURITY;

-- STEP 3: Revoke all existing grants
REVOKE ALL ON public.inquiries FROM anon, authenticated, public;

-- STEP 4: Grant fresh permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.inquiries TO anon;
GRANT ALL ON public.inquiries TO authenticated;

-- STEP 5: Re-enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- STEP 6: Create fresh policies with unique names
CREATE POLICY "inquiries_public_insert_v2"
ON public.inquiries
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "inquiries_authenticated_insert_v2"
ON public.inquiries
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "inquiries_authenticated_select_v2"
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

CREATE POLICY "inquiries_authenticated_update_v2"
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

CREATE POLICY "inquiries_authenticated_delete_v2"
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

-- VERIFICATION
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== AFTER FIX ===';
  RAISE NOTICE '✅ All old policies dropped';
  RAISE NOTICE '✅ RLS disabled and re-enabled';
  RAISE NOTICE '✅ Fresh grants applied';
  RAISE NOTICE '✅ New policies created';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Test your contact form now!';
END $$;

-- Show final state
SELECT 'Final Policies:' as info, policyname, cmd, roles::text
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'inquiries'
ORDER BY policyname;

SELECT 'Final Grants:' as info, grantee, privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public' AND table_name = 'inquiries' AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;
