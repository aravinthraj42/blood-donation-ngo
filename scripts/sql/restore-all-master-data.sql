-- =============================================================================
-- RESTORE ALL MASTER / REFERENCE DATA
-- =============================================================================
-- Run this in: Supabase Dashboard → SQL Editor
--
-- Restores ALL required reference data in one script:
--   1. blood_groups  (8 rows — required for donors, requests, availability)
--   2. settings      (13 rows — required for NGO info, public pages, rules)
--
-- WHAT THIS DOES NOT TOUCH:
--   ✓ admin_users    — your real admin accounts are preserved
--   ✓ donors         — real donor records are preserved
--   ✓ blood_requests — real request records are preserved
--   ✓ content        — your published posts are preserved
--   ✓ audit_logs     — history is preserved
--
-- Safe to run multiple times — ON CONFLICT DO NOTHING skips existing rows.
-- =============================================================================

BEGIN;

-- ----- 1. BLOOD GROUPS -------------------------------------------------------

INSERT INTO blood_groups (name, display_name, sort_order)
VALUES
  ('A_POSITIVE',  'A+',  0),
  ('A_NEGATIVE',  'A-',  1),
  ('B_POSITIVE',  'B+',  2),
  ('B_NEGATIVE',  'B-',  3),
  ('O_POSITIVE',  'O+',  4),
  ('O_NEGATIVE',  'O-',  5),
  ('AB_POSITIVE', 'AB+', 6),
  ('AB_NEGATIVE', 'AB-', 7)
ON CONFLICT (name) DO NOTHING;

-- ----- 2. SETTINGS -----------------------------------------------------------

INSERT INTO settings (key, value, value_type)
VALUES
  ('NGO_NAME',                          'Blood Connect',                                                                                                                                                          'string'),
  ('NGO_DESCRIPTION',                   'InfoPark News Initiate – Kochi. A non-profit initiative dedicated to saving lives through blood donation awareness and connecting donors with those in need.',            'string'),
  ('NGO_LOGO',                          '',                                                                                                                                                                        'string'),
  ('CONTACT_PHONE',                     '+91 1234567890',                                                                                                                                                          'string'),
  ('CONTACT_EMAIL',                     'contact@bloodconnect.org',                                                                                                                                                'string'),
  ('ADDRESS',                           'InfoPark, Kakkanad',                                                                                                                                                      'string'),
  ('CITY',                              'Kochi',                                                                                                                                                                   'string'),
  ('STATE',                             'Kerala',                                                                                                                                                                  'string'),
  ('SOCIAL_FACEBOOK',                   '',                                                                                                                                                                        'string'),
  ('SOCIAL_TWITTER',                    '',                                                                                                                                                                        'string'),
  ('SOCIAL_INSTAGRAM',                  '',                                                                                                                                                                        'string'),
  ('DONATION_ELIGIBILITY_INTERVAL_DAYS','90',                                                                                                                                                                      'string'),
  ('PUBLIC_BLOOD_AVAILABILITY_ENABLED', 'true',                                                                                                                                                                    'string')
ON CONFLICT (key) DO NOTHING;

COMMIT;

-- =============================================================================
-- VERIFICATION
-- =============================================================================

SELECT 'blood_groups' AS table_name, COUNT(*) AS rows FROM blood_groups
UNION ALL
SELECT 'settings',                    COUNT(*)           FROM settings
ORDER BY table_name;

-- Expected result:
--   blood_groups  │  8
--   settings      │  13
