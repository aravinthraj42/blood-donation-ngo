# Scripts

Utility scripts for managing the Blood Donation NGO platform database.

Each script has two versions:
- **`.ts` file** — run locally from your terminal using `npm run` or `npx tsx`
- **`sql/` file** — copy-paste into Supabase Dashboard → SQL Editor for deployment

---

## 1. Create New Admin User

Creates or updates an admin user record in the `admin_users` table.

### Prerequisite

The user must first exist in **Supabase Auth** before running this script:
1. Go to Supabase Dashboard → **Authentication → Users**
2. Click **Add user** → set email and password
3. Copy the UUID from the users list

### Run locally

```bash
npm run script:create-admin -- "<auth_user_id>" "<email>" "<full_name>" [role]

# Examples:
npm run script:create-admin -- "abc-123-uuid" "john@ngo.org" "John Doe"
npm run script:create-admin -- "abc-123-uuid" "jane@ngo.org" "Jane Doe" ADMIN
npm run script:create-admin -- "abc-123-uuid" "boss@ngo.org" "Boss Man" SUPER_ADMIN
```

### Run via Supabase SQL Editor

1. Open `scripts/sql/create-new-admin.sql`
2. Replace the three placeholder values at the top
3. Paste into Supabase Dashboard → SQL Editor → Run

### Roles

| Role | Access |
|------|--------|
| `SUPER_ADMIN` | Full access: manage admins, view audit logs, all settings |
| `ADMIN` | Standard: manage donors, requests, content, notifications |

---

## 2. Delete All Mock Data

Removes all sample/seed data created by `npm run db:seed`. Safe to run before going live.

### What is deleted

| Data | Identified by |
|------|---------------|
| Sample donors | Email `@example.com` or seeded phone numbers |
| Sample blood requests | Reference numbers `BD-YYYY-000001/2/3` |
| Sample content | Known seeded titles |
| Orphaned notifications | Not linked to any admin user |

### What is preserved

- Blood groups (required for the app)
- Settings (your configuration)
- Admin users (your real accounts)
- Audit logs (action history)
- Any real data you have added

### Run locally

```bash
npm run script:delete-mock           # interactive — asks for confirmation
npm run script:delete-mock -- --confirm  # skip confirmation prompt
```

### Run via Supabase SQL Editor

1. Open `scripts/sql/delete-all-mock.sql`
2. Copy the entire file contents
3. Paste into Supabase Dashboard → SQL Editor → Run
4. The script ends with a verification query showing row counts

---

## When to run each script

| Scenario | Script |
|----------|--------|
| Adding a new admin after deploying | `create-new-admin` |
| Preparing for production launch | `delete-all-mock` |
| Seeding fresh dev data | `npm run db:seed` |
