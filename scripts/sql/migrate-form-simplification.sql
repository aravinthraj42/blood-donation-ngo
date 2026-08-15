-- =============================================================================
-- FORM SIMPLIFICATION MIGRATION
-- =============================================================================
-- Run this ONCE in Supabase Dashboard → SQL Editor BEFORE deploying the
-- updated application code.
--
-- WHAT THIS DOES:
--   donors table:
--     + Adds age (integer)
--     + Adds is_it_employee (boolean, default false)
--     ~ Makes address, city, district, state, pincode nullable
--       (existing rows keep their data; new rows no longer require them)
--
--   blood_requests table:
--     + Adds requester_age, requester_last_donation_date,
--       requester_will_donate, requester_is_it_employee, requester_company
--     ~ Makes patient_name, hospital_name, hospital_location,
--       required_date nullable
-- =============================================================================

BEGIN;

-- ----- donors ----------------------------------------------------------------

ALTER TABLE donors
  ADD COLUMN IF NOT EXISTS age               INTEGER,
  ADD COLUMN IF NOT EXISTS is_it_employee    BOOLEAN NOT NULL DEFAULT FALSE,
  ALTER COLUMN address      DROP NOT NULL,
  ALTER COLUMN city         DROP NOT NULL,
  ALTER COLUMN district     DROP NOT NULL,
  ALTER COLUMN state        DROP NOT NULL,
  ALTER COLUMN pincode      DROP NOT NULL;

-- ----- blood_requests --------------------------------------------------------

ALTER TABLE blood_requests
  ADD COLUMN IF NOT EXISTS requester_age                INTEGER,
  ADD COLUMN IF NOT EXISTS requester_last_donation_date DATE,
  ADD COLUMN IF NOT EXISTS requester_will_donate        BOOLEAN,
  ADD COLUMN IF NOT EXISTS requester_is_it_employee     BOOLEAN,
  ADD COLUMN IF NOT EXISTS requester_company            VARCHAR(255),
  ALTER COLUMN patient_name      DROP NOT NULL,
  ALTER COLUMN hospital_name     DROP NOT NULL,
  ALTER COLUMN hospital_location DROP NOT NULL,
  ALTER COLUMN required_date     DROP NOT NULL;

COMMIT;

-- =============================================================================
-- VERIFICATION
-- =============================================================================
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'donors'
  AND column_name IN ('age', 'is_it_employee', 'address', 'city', 'district', 'state', 'pincode')
ORDER BY column_name;

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'blood_requests'
  AND column_name IN (
    'requester_age', 'requester_last_donation_date', 'requester_will_donate',
    'requester_is_it_employee', 'requester_company',
    'patient_name', 'hospital_name', 'hospital_location', 'required_date'
  )
ORDER BY column_name;
