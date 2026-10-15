-- Manual Database Cleanup Script
-- Run this directly in your Vercel Postgres SQL console
-- This will permanently delete all users with status='deleted'

-- Step 1: Check which users will be deleted
SELECT 
  wallet_id, 
  email, 
  status, 
  created_at 
FROM users 
WHERE status = 'deleted'
ORDER BY created_at DESC;

-- Step 2: Delete the users (uncomment to execute)
-- DELETE FROM users WHERE status = 'deleted';

-- Step 3: Verify deletion (should show 0 rows)
-- SELECT COUNT(*) as deleted_users FROM users WHERE status = 'deleted';

-- Step 4: View remaining active users
-- SELECT 
--   wallet_id, 
--   email, 
--   status, 
--   balance,
--   created_at 
-- FROM users 
-- WHERE status = 'active'
-- ORDER BY created_at DESC;
