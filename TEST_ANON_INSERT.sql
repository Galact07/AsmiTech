-- ============================================================================
-- TEST: Verify anonymous INSERT works at database level
-- This simulates what the anon role should be able to do
-- ============================================================================

-- Set role to anon (simulating anonymous user)
SET ROLE anon;

-- Try to insert a test record
INSERT INTO public.inquiries (name, email, company, phone, message, subject, status)
VALUES (
  'Test User',
  'test@example.com',
  'Test Company',
  '+1234567890',
  'Test message',
  'Test Subject',
  'new'
);

-- Reset role
RESET ROLE;

-- Check if the insert worked
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ SUCCESS: Anonymous INSERT works!'
    ELSE '❌ FAILED: Anonymous INSERT did not work'
  END as result,
  COUNT(*) as test_records_inserted
FROM public.inquiries
WHERE email = 'test@example.com';

-- Clean up test data
DELETE FROM public.inquiries WHERE email = 'test@example.com';

SELECT '✅ Test complete and cleaned up' as status;
