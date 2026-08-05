/**
 * Create a new admin user in the database.
 *
 * PREREQUISITES:
 *   1. Go to Supabase Dashboard → Authentication → Users
 *   2. Click "Add user" and create the user with email + password
 *   3. Copy the UUID shown in the user list
 *   4. Run this script with that UUID
 *
 * USAGE:
 *   npx tsx scripts/create-new-admin.ts <auth_user_id> <email> <full_name> [role]
 *
 * EXAMPLES:
 *   npx tsx scripts/create-new-admin.ts "uuid-here" "john@example.com" "John Doe"
 *   npx tsx scripts/create-new-admin.ts "uuid-here" "jane@example.com" "Jane Doe" ADMIN
 *   npx tsx scripts/create-new-admin.ts "uuid-here" "boss@example.com" "Boss Man" SUPER_ADMIN
 *
 * ROLES:
 *   SUPER_ADMIN  - Full access: can manage admin users, view audit logs, all settings
 *   ADMIN        - Standard access: manage donors, requests, content, notifications
 *
 * Default role is SUPER_ADMIN if not specified.
 */

import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { adminUsers } from "../src/db/schema/admin-users";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const [authUserId, email, fullName, role] = process.argv.slice(2);

if (!authUserId || !email || !fullName) {
  console.error(
    "\n❌ Missing required arguments.\n" +
    "Usage: npx tsx scripts/create-new-admin.ts <auth_user_id> <email> <full_name> [role]\n" +
    'Example: npx tsx scripts/create-new-admin.ts "abc-123" "admin@ngo.org" "Admin Name" SUPER_ADMIN\n'
  );
  process.exit(1);
}

const validRoles = ["SUPER_ADMIN", "ADMIN"];
const adminRole = (role || "SUPER_ADMIN").toUpperCase();

if (!validRoles.includes(adminRole)) {
  console.error(`\n❌ Invalid role "${role}". Must be SUPER_ADMIN or ADMIN.\n`);
  process.exit(1);
}

const db = drizzle(postgres(process.env.DATABASE_URL!, { max: 1 }));

async function main() {
  console.log("\n👤 Creating admin user...");
  console.log(`   Auth ID : ${authUserId}`);
  console.log(`   Email   : ${email}`);
  console.log(`   Name    : ${fullName}`);
  console.log(`   Role    : ${adminRole}\n`);

  const [admin] = await db
    .insert(adminUsers)
    .values({
      authUserId,
      email,
      fullName,
      role: adminRole as "SUPER_ADMIN" | "ADMIN",
      isActive: true,
    })
    .onConflictDoUpdate({
      target: adminUsers.authUserId,
      set: {
        email,
        fullName,
        role: adminRole as "SUPER_ADMIN" | "ADMIN",
        isActive: true,
        updatedAt: new Date(),
      },
    })
    .returning();

  console.log("✅ Admin user created/updated successfully!\n");
  console.log("📋 Record:");
  console.log(`   ID      : ${admin.id}`);
  console.log(`   Email   : ${admin.email}`);
  console.log(`   Name    : ${admin.fullName}`);
  console.log(`   Role    : ${admin.role}`);
  console.log(`   Active  : ${admin.isActive}`);
  console.log(`   Created : ${admin.createdAt}\n`);
  console.log("👉 The user can now log in at /admin/login with their Supabase Auth credentials.\n");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n❌ Error:", err.message);
    process.exit(1);
  });
