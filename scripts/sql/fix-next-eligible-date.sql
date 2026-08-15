-- Fix nextEligibleDate for all donors where it is NULL or outdated.
-- This recalculates nextEligibleDate as lastDonationDate + 90 days.
-- Run this once in the Supabase SQL Editor to fix existing donor records.

UPDATE donors
SET next_eligible_date = (last_donation_date::date + INTERVAL '90 days')::date
WHERE last_donation_date IS NOT NULL
  AND (
    next_eligible_date IS NULL
    OR next_eligible_date != (last_donation_date::date + INTERVAL '90 days')::date
  );

-- Verify the result
SELECT
  full_name,
  last_donation_date,
  next_eligible_date,
  donor_status,
  consent_to_contact,
  CASE
    WHEN next_eligible_date <= CURRENT_DATE THEN 'Eligible Now'
    ELSE 'Not Yet Eligible'
  END AS eligibility
FROM donors
WHERE donor_status = 'ACTIVE'
ORDER BY next_eligible_date;
