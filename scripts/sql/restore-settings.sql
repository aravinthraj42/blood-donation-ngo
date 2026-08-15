-- =============================================================================
-- RESTORE DEFAULT APPLICATION SETTINGS
-- =============================================================================
-- Run this in: Supabase Dashboard → SQL Editor
--
-- Restores the default settings rows required for the app to work correctly.
-- Safe to run multiple times — ON CONFLICT DO NOTHING skips existing rows.
--
-- NOTE: If you have customised any setting values (e.g. NGO_NAME, phone),
--       use the Admin Panel → Settings page to update them after restoring,
--       OR edit the values below before running.
-- =============================================================================

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

-- Verify
SELECT key, value, value_type, updated_at
FROM settings
ORDER BY key;
