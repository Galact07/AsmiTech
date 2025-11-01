-- ============================================================================
-- CRITICAL: Grant table-level permissions to anon role
-- This fixes "permission denied for table inquiries"
-- ============================================================================

-- First, verify current grants
SELECT 
  'BEFORE GRANT:' as status,
  grantee, 
  string_agg(privilege_type, ', ' ORDER BY privilege_type) as privileges
FROM information_schema.table_privileges
WHERE table_schema = 'public' 
  AND table_name = 'inquiries'
GROUP BY grantee
ORDER BY grantee;

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant table-level permissions explicitly
GRANT INSERT ON TABLE public.inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.inquiries TO authenticated;

-- Also grant on the sequence (for id generation)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Verify grants were applied
SELECT 
  'AFTER GRANT:' as status,
  grantee, 
  string_agg(privilege_type, ', ' ORDER BY privilege_type) as privileges
FROM information_schema.table_privileges
WHERE table_schema = 'public' 
  AND table_name = 'inquiries'
GROUP BY grantee
ORDER BY grantee;

-- Show RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'inquiries';

-- Show policies
SELECT 
  policyname,
  cmd,
  roles::text,
  permissive
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'inquiries'
ORDER BY policyname;
