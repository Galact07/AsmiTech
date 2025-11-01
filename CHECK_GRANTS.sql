-- Check if anon has INSERT grant
SELECT 
  grantee, 
  privilege_type,
  is_grantable
FROM information_schema.table_privileges
WHERE table_schema = 'public' 
  AND table_name = 'inquiries'
  AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;
