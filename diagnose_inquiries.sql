-- DIAGNOSTIC SCRIPT: Run this to see what's happening with the inquiries table
-- Copy the results and share them so we can identify the issue

-- 1. Check if table exists and its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'inquiries'
ORDER BY ordinal_position;

-- 2. Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename = 'inquiries';

-- 3. List ALL policies on inquiries table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'inquiries'
ORDER BY policyname;

-- 4. Check grants/permissions
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants
WHERE table_schema = 'public' 
AND table_name = 'inquiries'
ORDER BY grantee, privilege_type;

-- 5. Check if anon role exists and has permissions
SELECT 
    rolname,
    rolsuper
FROM pg_roles
WHERE rolname IN ('anon', 'authenticated', 'authenticator');

-- 6. Test: Try to see what happens with a simple insert (this might fail but shows the error)
-- DO NOT RUN THIS IF YOU HAVE RLS ENABLED - it's just to see the error
-- INSERT INTO public.inquiries (name, email, message, subject, status) 
-- VALUES ('Test', 'test@test.com', 'Test message', 'Test', 'new');

