-- ============================================================================
-- FIX INQUIRIES TABLE RLS POLICIES ONLY
-- This script drops and recreates ONLY inquiries table policies
-- Safe to run multiple times (idempotent)
-- ============================================================================

-- ============================================================================
-- STEP 1: DROP ALL EXISTING INQUIRIES POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can create inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow anonymous inquiry submissions" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can manage inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can view inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can update inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can delete inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "allow_anonymous_inquiry_insert" ON public.inquiries;
DROP POLICY IF EXISTS "allow_admin_inquiry_select" ON public.inquiries;
DROP POLICY IF EXISTS "allow_admin_inquiry_update" ON public.inquiries;
DROP POLICY IF EXISTS "allow_admin_inquiry_delete" ON public.inquiries;

-- ============================================================================
-- STEP 2: ENSURE RLS IS ENABLED ON INQUIRIES TABLE
-- ============================================================================

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 3: GRANT NECESSARY PERMISSIONS TO ROLES FOR INQUIRIES
-- ============================================================================

-- Grant schema usage (safe to run multiple times)
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant table permissions for inquiries
GRANT SELECT, INSERT ON public.inquiries TO anon, authenticated;
GRANT UPDATE, DELETE ON public.inquiries TO authenticated;

-- ============================================================================
-- STEP 4: CREATE NEW RLS POLICIES FOR INQUIRIES TABLE
-- ============================================================================

-- Policy 1: Allow anyone (anon + authenticated) to submit inquiries
CREATE POLICY "allow_anonymous_inquiry_insert"
ON public.inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy 2: Allow authenticated admins to view all inquiries
CREATE POLICY "allow_admin_inquiry_select"
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

-- Policy 3: Allow authenticated admins to update inquiries
CREATE POLICY "allow_admin_inquiry_update"
ON public.inquiries
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy 4: Allow authenticated admins to delete inquiries
CREATE POLICY "allow_admin_inquiry_delete"
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

-- ============================================================================
-- STEP 5: VERIFY POLICIES (OPTIONAL - FOR DEBUGGING)
-- ============================================================================

-- Uncomment to see all inquiries policies after creation:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE schemaname = 'public' AND tablename = 'inquiries'
-- ORDER BY policyname;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Inquiries table RLS policies have been successfully recreated!';
  RAISE NOTICE '📋 Summary:';
  RAISE NOTICE '   ✓ Anonymous users (anon) can INSERT inquiries without restrictions';
  RAISE NOTICE '   ✓ Authenticated admins can SELECT all inquiries';
  RAISE NOTICE '   ✓ Authenticated admins can UPDATE inquiries';
  RAISE NOTICE '   ✓ Authenticated admins can DELETE inquiries';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Your /contact form should now work perfectly!';
END $$;
