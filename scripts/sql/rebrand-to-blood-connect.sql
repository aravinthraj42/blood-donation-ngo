-- =============================================================================
-- REBRAND: LifeBlood Foundation → Blood Connect
-- =============================================================================
-- Run this in: Supabase Dashboard → SQL Editor
--
-- PURPOSE:
--   Updates the NGO_NAME, NGO_DESCRIPTION, CONTACT_EMAIL, ADDRESS, CITY, and
--   STATE rows in the settings table to reflect the new brand identity.
--
-- WHAT IS CHANGED:
--   ✓ NGO_NAME          → "Blood Connect"
--   ✓ NGO_DESCRIPTION   → InfoPark News Initiate – Kochi description
--   ✓ CONTACT_EMAIL     → contact@bloodconnect.org
--   ✓ ADDRESS           → InfoPark, Kakkanad
--   ✓ CITY              → Kochi
--   ✓ STATE             → Kerala
--
-- WHAT IS PRESERVED:
--   All other settings (phone, social links, donation eligibility, etc.)
-- =============================================================================

BEGIN;

UPDATE settings SET value = 'Blood Connect',                                                   updated_at = NOW() WHERE key = 'NGO_NAME';
UPDATE settings SET value = 'InfoPark News Initiate – Kochi. A non-profit initiative dedicated to saving lives through blood donation awareness and connecting donors with those in need.',
                            updated_at = NOW() WHERE key = 'NGO_DESCRIPTION';
UPDATE settings SET value = 'contact@bloodconnect.org',                                        updated_at = NOW() WHERE key = 'CONTACT_EMAIL';
UPDATE settings SET value = 'InfoPark, Kakkanad',                                              updated_at = NOW() WHERE key = 'ADDRESS';
UPDATE settings SET value = 'Kochi',                                                           updated_at = NOW() WHERE key = 'CITY';
UPDATE settings SET value = 'Kerala',                                                          updated_at = NOW() WHERE key = 'STATE';

COMMIT;

-- =============================================================================
-- VERIFICATION — Confirm updated values
-- =============================================================================
SELECT key, value, updated_at
FROM settings
WHERE key IN ('NGO_NAME', 'NGO_DESCRIPTION', 'CONTACT_EMAIL', 'ADDRESS', 'CITY', 'STATE')
ORDER BY key;
