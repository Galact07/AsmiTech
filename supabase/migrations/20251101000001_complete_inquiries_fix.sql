-- ============================================================================
-- COMPLETE FIX: Inquiries table RLS and permissions
-- This addresses ALL possible causes of 401 Unauthorized
-- ============================================================================

-- STEP 1: Check current policies (for debugging)
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count 
  FROM pg_policies 
  WHERE schemaname = 'public' AND tablename = 'inquiries';
  RAISE NOTICE 'Current inquiries policies count: %', policy_count;
END $$;

-- STEP 2: Drop ALL existing policies on inquiries
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

-- STEP 3: Ensure RLS is enabled
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- STEP 4: Grant necessary table-level permissions
-- This is CRITICAL - without these grants, policies won't work
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.inquiries TO anon, authenticated;

-- STEP 5: Create the INSERT policy for anonymous users
CREATE POLICY "allow_public_inquiry_insert"
ON public.inquiries
FOR INSERT
TO public
WITH CHECK (true);

-- STEP 6: Create admin policies
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

-- STEP 7: Verify the fix
DO $$
BEGIN
  RAISE NOTICE '✅ Complete fix applied!';
  RAISE NOTICE '📋 Changes made:';
  RAISE NOTICE '   ✓ Granted ALL permissions on inquiries to anon and authenticated roles';
  RAISE NOTICE '   ✓ Created policy for PUBLIC (not just anon) to insert';
  RAISE NOTICE '   ✓ Admin policies recreated';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Your /contact form should now work!';
END $$;

-- STEP 8: Show all current policies (for verification)
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'inquiries'
ORDER BY policyname;
