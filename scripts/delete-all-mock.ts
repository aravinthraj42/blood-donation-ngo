/**
 * Delete all mock/seed data from the database.
 *
 * Removes sample data created by the seed script (npm run db:seed).
 * Safe to run — it identifies mock data by known identifiers and
 * does NOT delete: blood groups, settings, admin users, or audit logs.
 *
 * WHAT GETS DELETED:
 *   - Donors with @example.com emails or seeded phone numbers
 *   - Blood requests with reference numbers BD-YEAR-000001/2/3
 *   - Sample content items (by known titles)
 *   - Orphaned notifications (not linked to any admin)
 *
 * WHAT IS PRESERVED:
 *   - Blood groups (essential lookup data)
 *   - Settings (application configuration)
 *   - Admin users (your real admin accounts)
 *   - Audit logs (history)
 *   - Any real donor/request/content data you added
 *
 * USAGE:
 *   npx tsx scripts/delete-all-mock.ts
 *   npx tsx scripts/delete-all-mock.ts --confirm    (skip confirmation prompt)
 */

import * as dotenv from "dotenv";
import * as readline from "readline";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { inArray, isNull, like, or } from "drizzle-orm";
import { donors, bloodRequests, content, notifications } from "../src/db/schema";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const skipConfirm = process.argv.includes("--confirm");

const MOCK_DONOR_PHONES = [
  "+919876543210",
  "+919876543211",
  "+919876543212",
  "+919876543213",
  "+919876543214",
];

const MOCK_REQUEST_REFS_PATTERN = /^BD-\d{4}-00000[1-3]$/;

const MOCK_CONTENT_TITLES = [
  "Every Drop Counts",
  "World Blood Donor Day",
  "Health Tips for Donors",
  "Dr. Sarah's Message",
  '"The gift of blood is the gift of life."',
  "Blood Donation Camp - August 2026",
];

const client = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(client);

async function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().startsWith("y"));
    });
  });
}

async function main() {
  console.log("\n🧹 Delete Mock/Seed Data");
  console.log("========================\n");

  // Preview what will be deleted
  const [mockDonors, allRequests, mockContent, orphanNotifs] = await Promise.all([
    db.select({ id: donors.id, fullName: donors.fullName, phone: donors.phone })
      .from(donors)
      .where(
        or(
          like(donors.email, "%@example.com"),
          inArray(donors.phone, MOCK_DONOR_PHONES)
        )
      ),
    db.select({ id: bloodRequests.id, refNo: bloodRequests.referenceNumber })
      .from(bloodRequests),
    db.select({ id: content.id, title: content.title })
      .from(content)
      .where(inArray(content.title, MOCK_CONTENT_TITLES)),
    db.select({ id: notifications.id })
      .from(notifications)
      .where(isNull(notifications.adminId)),
  ]);

  const mockRequests = allRequests.filter((r) =>
    MOCK_REQUEST_REFS_PATTERN.test(r.refNo)
  );

  console.log("📋 The following mock data will be deleted:");
  console.log(`\n   Donors (${mockDonors.length}):`);
  mockDonors.forEach((d) => console.log(`     - ${d.fullName} (${d.phone})`));

  console.log(`\n   Blood Requests (${mockRequests.length}):`);
  mockRequests.forEach((r) => console.log(`     - ${r.refNo}`));

  console.log(`\n   Content items (${mockContent.length}):`);
  mockContent.forEach((c) => console.log(`     - ${c.title}`));

  console.log(`\n   Orphaned Notifications (${orphanNotifs.length})`);

  const total = mockDonors.length + mockRequests.length + mockContent.length + orphanNotifs.length;
  if (total === 0) {
    console.log("\n✅ No mock data found. Nothing to delete.\n");
    await client.end();
    return;
  }

  console.log(`\n   Total rows to delete: ${total}\n`);

  if (!skipConfirm) {
    const ok = await confirm("❓ Proceed with deletion? (y/N): ");
    if (!ok) {
      console.log("\n⛔ Aborted. No data was deleted.\n");
      await client.end();
      return;
    }
  }

  console.log("\n🗑️  Deleting...");

  // Delete donors
  if (mockDonors.length > 0) {
    const ids = mockDonors.map((d) => d.id);
    await db.delete(donors).where(inArray(donors.id, ids));
    console.log(`   ✓ Deleted ${mockDonors.length} sample donors`);
  }

  // Delete blood requests
  if (mockRequests.length > 0) {
    const ids = mockRequests.map((r) => r.id);
    await db.delete(bloodRequests).where(inArray(bloodRequests.id, ids));
    console.log(`   ✓ Deleted ${mockRequests.length} sample blood requests`);
  }

  // Delete content
  if (mockContent.length > 0) {
    const ids = mockContent.map((c) => c.id);
    await db.delete(content).where(inArray(content.id, ids));
    console.log(`   ✓ Deleted ${mockContent.length} sample content items`);
  }

  // Delete orphaned notifications
  if (orphanNotifs.length > 0) {
    const ids = orphanNotifs.map((n) => n.id);
    await db.delete(notifications).where(inArray(notifications.id, ids));
    console.log(`   ✓ Deleted ${orphanNotifs.length} orphaned notifications`);
  }

  console.log("\n✅ Mock data deleted successfully!\n");
  console.log("💡 Your blood groups, settings, admin users, and audit logs are untouched.\n");

  await client.end();
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
});
