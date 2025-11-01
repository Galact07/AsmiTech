-- ============================================================================
-- COPY AND PASTE THIS ENTIRE SCRIPT INTO SUPABASE SQL EDITOR
-- This is the definitive fix for the 401 Unauthorized error
-- ============================================================================

-- Step 1: Drop ALL existing policies on inquiries
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'inquiries')
    LOOP
        EXECUTE 'DROP POLICY "' || r.policyname || '" ON public.inquiries';
        RAISE NOTICE 'Dropped: %', r.policyname;
    END LOOP;
END $$;

-- Step 2: Ensure RLS is enabled
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Step 3: Grant INSERT permission to anon role
GRANT INSERT ON public.inquiries TO anon;

-- Step 4: Create INSERT policy for anonymous users
CREATE POLICY "inquiries_anon_insert"
ON public.inquiries
FOR INSERT
TO anon
WITH CHECK (true);

-- Step 5: Create INSERT policy for authenticated users
CREATE POLICY "inquiries_auth_insert"
ON public.inquiries
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Step 6: Create admin SELECT policy
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

-- Step 7: Create admin UPDATE policy
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

-- Step 8: Create admin DELETE policy
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

-- Verification
SELECT 
  '✅ SUCCESS!' as status,
  COUNT(*) as total_policies
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'inquiries';

-- Show all policies
SELECT 
  policyname,
  cmd as command,
  roles::text as applies_to
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'inquiries'
ORDER BY policyname;
