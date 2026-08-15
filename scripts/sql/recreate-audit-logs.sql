-- =============================================================================
-- RECREATE audit_logs TABLE
-- =============================================================================
-- Run this in: Supabase Dashboard → SQL Editor
--
-- Use this if the audit_logs table was accidentally dropped.
-- Safe to run even if parts (like the enum) already exist.
-- =============================================================================

-- Step 1: Recreate the enum type (skipped if it already exists)
DO $$ BEGIN
  CREATE TYPE audit_action AS ENUM (
    'ADMIN_LOGIN',
    'DONOR_CREATED',
    'DONOR_UPDATED',
    'DONOR_VERIFIED',
    'DONOR_DEACTIVATED',
    'DONOR_ACTIVATED',
    'REQUEST_CREATED',
    'REQUEST_UPDATED',
    'REQUEST_STATUS_CHANGED',
    'CONTENT_CREATED',
    'CONTENT_UPDATED',
    'CONTENT_PUBLISHED',
    'CONTENT_DELETED',
    'ADMIN_CREATED',
    'ADMIN_ROLE_CHANGED',
    'ADMIN_DEACTIVATED',
    'SETTINGS_UPDATED'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Step 2: Recreate the table
CREATE TABLE IF NOT EXISTS audit_logs (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id        UUID         REFERENCES admin_users(id),
  action          audit_action NOT NULL,
  entity_type     VARCHAR(50),
  entity_id       UUID,
  metadata        JSONB,
  ip_address      VARCHAR(45),
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Step 3: Recreate indexes
CREATE INDEX IF NOT EXISTS audit_logs_admin_id_idx    ON audit_logs (admin_id);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx      ON audit_logs (action);
CREATE INDEX IF NOT EXISTS audit_logs_entity_type_idx ON audit_logs (entity_type);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx  ON audit_logs (created_at);

-- Step 4: Verify
SELECT 'audit_logs table recreated successfully' AS status;
SELECT COUNT(*) AS row_count FROM audit_logs;
