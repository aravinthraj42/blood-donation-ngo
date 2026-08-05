-- =============================================================================
-- DELETE ALL MOCK / SEED DATA
-- =============================================================================
-- Run this in: Supabase Dashboard → SQL Editor
--
-- PURPOSE:
--   Removes all sample data created by the development seed script.
--   Safe to run — identifies mock data by known emails, phone numbers,
--   reference numbers, and content titles.
--
-- WHAT IS DELETED:
--   ✗ Sample donors (emails ending in @example.com or seeded phone numbers)
--   ✗ Sample blood requests (reference numbers BD-YYYY-000001/2/3)
--   ✗ Sample content items (the 6 seeded health awareness posts)
--   ✗ Orphaned notifications (not linked to any admin user)
--
-- WHAT IS PRESERVED:
--   ✓ Blood groups  (required for the app to work)
--   ✓ Settings      (application configuration)
--   ✓ Admin users   (your real admin accounts)
--   ✓ Audit logs    (action history)
--   ✓ Any real data you have added
-- =============================================================================

BEGIN;

-- ----- 1. DELETE SAMPLE NOTIFICATIONS (orphaned / not linked to an admin) -----
DELETE FROM notifications
WHERE admin_id IS NULL;

-- ----- 2. DELETE SAMPLE BLOOD REQUESTS ----------------------------------------
-- Matches the 3 seeded reference numbers for any year (BD-YYYY-000001/2/3)
DELETE FROM blood_requests
WHERE reference_number ~ '^BD-[0-9]{4}-00000[1-3]$';

-- ----- 3. DELETE SAMPLE DONORS -------------------------------------------------
-- Matches by @example.com email OR the seeded phone numbers
DELETE FROM donors
WHERE email LIKE '%@example.com'
   OR phone IN (
     '+919876543210',
     '+919876543211',
     '+919876543212',
     '+919876543213',
     '+919876543214'
   );

-- ----- 4. DELETE SAMPLE CONTENT ------------------------------------------------
DELETE FROM content
WHERE title IN (
  'Every Drop Counts',
  'World Blood Donor Day',
  'Health Tips for Donors',
  'Dr. Sarah''s Message',
  '"The gift of blood is the gift of life."',
  'Blood Donation Camp - August 2026'
);

COMMIT;

-- =============================================================================
-- VERIFICATION — Check remaining row counts after deletion
-- =============================================================================
SELECT 'blood_groups'  AS table_name, COUNT(*) AS rows FROM blood_groups
UNION ALL
SELECT 'settings',       COUNT(*) FROM settings
UNION ALL
SELECT 'admin_users',    COUNT(*) FROM admin_users
UNION ALL
SELECT 'donors',         COUNT(*) FROM donors
UNION ALL
SELECT 'blood_requests', COUNT(*) FROM blood_requests
UNION ALL
SELECT 'content',        COUNT(*) FROM content
UNION ALL
SELECT 'notifications',  COUNT(*) FROM notifications
UNION ALL
SELECT 'audit_logs',     COUNT(*) FROM audit_logs
ORDER BY table_name;
