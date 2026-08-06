-- =============================================================================
-- CREATE NEW ADMIN USER
-- =============================================================================
-- Run this in: Supabase Dashboard → SQL Editor
--
-- STEP 1: First create the user in Supabase Auth:
--         Go to Authentication → Users → Add user
--         Set their email and password
--         Copy the UUID shown in the user list
--
-- STEP 2: Replace the placeholders below and run this SQL.
-- =============================================================================

-- ⚙️  EDIT THESE VALUES BEFORE RUNNING:
DO $$
DECLARE
  v_auth_user_id  UUID    := '15f22534-010d-47de-93a4-a6ce475ba61e';  -- from Supabase Auth → Users
  v_email         TEXT    := 'aravinthraj42@gmail.com';        -- must match Auth user email
  v_full_name     TEXT    := 'Aravinth Raj J';
  v_role          TEXT    := 'SUPER_ADMIN';                 -- 'SUPER_ADMIN' or 'ADMIN'
BEGIN
  INSERT INTO admin_users (auth_user_id, email, full_name, role, is_active)
  VALUES (v_auth_user_id, v_email, v_full_name, v_role::admin_role, TRUE)
  ON CONFLICT (auth_user_id)
  DO UPDATE SET
    email      = EXCLUDED.email,
    full_name  = EXCLUDED.full_name,
    role       = EXCLUDED.role,
    is_active  = TRUE,
    updated_at = NOW();

  RAISE NOTICE 'Admin user created/updated: % (%) — Role: %', v_full_name, v_email, v_role;
END $$;

-- Verify the record was created:
SELECT id, auth_user_id, email, full_name, role, is_active, created_at
FROM admin_users
ORDER BY created_at DESC
LIMIT 10;
