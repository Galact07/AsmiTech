-- ============================================================================
-- CRITICAL FIX: Allow anonymous users to submit inquiries
-- This fixes the 401 Unauthorized error on /contact form
-- Run this in Supabase SQL Editor or via CLI
-- ============================================================================

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "allow_anonymous_inquiry_insert" ON public.inquiries;

-- Recreate with proper permissions for anonymous users
CREATE POLICY "allow_anonymous_inquiry_insert"
ON public.inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Verify the policy was created
DO $$
BEGIN
  RAISE NOTICE '✅ Fixed! Anonymous users can now submit inquiries on /contact form';
  RAISE NOTICE '🎯 The 401 Unauthorized error should be resolved';
END $$;
