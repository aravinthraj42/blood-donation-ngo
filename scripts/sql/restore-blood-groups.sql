-- =============================================================================
-- RESTORE BLOOD GROUPS MASTER DATA
-- =============================================================================
-- Run this in: Supabase Dashboard → SQL Editor
--
-- Restores the 8 standard blood group records required for the app to work.
-- Safe to run multiple times — ON CONFLICT DO NOTHING skips existing rows.
-- =============================================================================

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

-- Verify
SELECT id, name, display_name, sort_order, created_at
FROM blood_groups
ORDER BY sort_order;
