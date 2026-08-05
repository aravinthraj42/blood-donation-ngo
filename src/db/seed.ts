import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import { bloodGroups, settings, content, donors, bloodRequests, notifications } from "./schema";
import { BLOOD_GROUPS, DEFAULT_SETTINGS } from "@/config/constants";
import { addDays, subDays } from "date-fns";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  console.error("DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

async function seed() {
  console.log("🌱 Starting database seed...\n");

  // Seed Blood Groups
  console.log("📝 Seeding blood groups...");
  const bloodGroupRecords = await db
    .insert(bloodGroups)
    .values(
      BLOOD_GROUPS.map((bg, index) => ({
        name: bg.name,
        displayName: bg.displayName,
        sortOrder: index,
      }))
    )
    .onConflictDoNothing()
    .returning();
  console.log(`   ✓ Created ${bloodGroupRecords.length} blood groups\n`);

  // Get blood group IDs for reference
  const bloodGroupMap = new Map<string, string>();
  const allBloodGroups = await db.select().from(bloodGroups);
  allBloodGroups.forEach((bg) => {
    bloodGroupMap.set(bg.name, bg.id);
  });

  // Seed Default Settings
  console.log("⚙️  Seeding default settings...");
  const settingsToInsert = Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({
    key,
    value: String(value),
    valueType: typeof value === "number" ? "number" : typeof value === "boolean" ? "boolean" : "string",
  }));
  
  const settingsRecords = await db
    .insert(settings)
    .values(settingsToInsert)
    .onConflictDoNothing()
    .returning();
  console.log(`   ✓ Created ${settingsRecords.length} settings\n`);

  // Seed Sample Content (for development)
  console.log("📰 Seeding sample content...");
  const sampleContent = [
    {
      title: "Every Drop Counts",
      description: "Your single blood donation can save up to 3 lives. Be a hero today!",
      category: "BLOOD_DONATION" as const,
      status: "PUBLISHED" as const,
      publishAt: new Date(),
    },
    {
      title: "World Blood Donor Day",
      description: "Join us in celebrating the selfless act of blood donation. Together, we can make a difference.",
      category: "AWARENESS" as const,
      status: "PUBLISHED" as const,
      publishAt: new Date(),
    },
    {
      title: "Health Tips for Donors",
      description: "Stay hydrated, eat iron-rich foods, and get adequate rest before and after donation for the best experience.",
      category: "HEALTHCARE" as const,
      status: "PUBLISHED" as const,
      publishAt: new Date(),
    },
    {
      title: "Dr. Sarah's Message",
      description: "Regular blood donation not only helps others but also has health benefits for donors, including reduced iron stores and improved cardiovascular health.",
      category: "DOCTOR_MESSAGE" as const,
      status: "PUBLISHED" as const,
      publishAt: new Date(),
    },
    {
      title: "\"The gift of blood is the gift of life.\"",
      description: "- Unknown",
      category: "QUOTE" as const,
      status: "PUBLISHED" as const,
      publishAt: new Date(),
    },
    {
      title: "Blood Donation Camp - August 2026",
      description: "Join us at the community center on August 15th for our monthly blood donation camp. Free health checkup for all donors!",
      category: "ANNOUNCEMENT" as const,
      status: "PUBLISHED" as const,
      publishAt: new Date(),
    },
  ];

  const contentRecords = await db
    .insert(content)
    .values(sampleContent)
    .onConflictDoNothing()
    .returning();
  console.log(`   ✓ Created ${contentRecords.length} content items\n`);

  // Seed Sample Donors (for development)
  console.log("👤 Seeding sample donors...");
  const sampleDonors = [
    {
      fullName: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+919876543210",
      bloodGroupId: bloodGroupMap.get("O_POSITIVE")!,
      dateOfBirth: "1990-05-15",
      lastDonationDate: subDays(new Date(), 100).toISOString().split("T")[0],
      nextEligibleDate: addDays(subDays(new Date(), 100), 90).toISOString().split("T")[0],
      address: "123 MG Road",
      city: "Mumbai",
      district: "Mumbai Suburban",
      state: "Maharashtra",
      pincode: "400001",
      occupation: "Software Engineer",
      preferredContactMethod: "WHATSAPP" as const,
      consentToContact: true,
      donorStatus: "ACTIVE" as const,
      verificationStatus: "VERIFIED" as const,
    },
    {
      fullName: "Priya Patel",
      email: "priya.patel@example.com",
      phone: "+919876543211",
      bloodGroupId: bloodGroupMap.get("A_POSITIVE")!,
      dateOfBirth: "1995-08-22",
      lastDonationDate: subDays(new Date(), 60).toISOString().split("T")[0],
      nextEligibleDate: addDays(subDays(new Date(), 60), 90).toISOString().split("T")[0],
      address: "456 Park Street",
      city: "Pune",
      district: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      occupation: "Teacher",
      preferredContactMethod: "PHONE" as const,
      consentToContact: true,
      donorStatus: "ACTIVE" as const,
      verificationStatus: "VERIFIED" as const,
    },
    {
      fullName: "Amit Kumar",
      email: "amit.kumar@example.com",
      phone: "+919876543212",
      bloodGroupId: bloodGroupMap.get("B_POSITIVE")!,
      dateOfBirth: "1988-12-10",
      lastDonationDate: subDays(new Date(), 30).toISOString().split("T")[0],
      nextEligibleDate: addDays(subDays(new Date(), 30), 90).toISOString().split("T")[0],
      address: "789 Lake View",
      city: "Nagpur",
      district: "Nagpur",
      state: "Maharashtra",
      pincode: "440001",
      occupation: "Doctor",
      preferredContactMethod: "EMAIL" as const,
      consentToContact: true,
      donorStatus: "ACTIVE" as const,
      verificationStatus: "VERIFIED" as const,
    },
    {
      fullName: "Sneha Reddy",
      phone: "+919876543213",
      bloodGroupId: bloodGroupMap.get("AB_POSITIVE")!,
      lastDonationDate: subDays(new Date(), 200).toISOString().split("T")[0],
      nextEligibleDate: addDays(subDays(new Date(), 200), 90).toISOString().split("T")[0],
      address: "321 Hill Road",
      city: "Thane",
      district: "Thane",
      state: "Maharashtra",
      pincode: "400601",
      preferredContactMethod: "PHONE" as const,
      consentToContact: true,
      donorStatus: "PENDING" as const,
      verificationStatus: "UNVERIFIED" as const,
    },
    {
      fullName: "Vikram Singh",
      email: "vikram.singh@example.com",
      phone: "+919876543214",
      bloodGroupId: bloodGroupMap.get("O_NEGATIVE")!,
      dateOfBirth: "1985-03-25",
      lastDonationDate: subDays(new Date(), 120).toISOString().split("T")[0],
      nextEligibleDate: addDays(subDays(new Date(), 120), 90).toISOString().split("T")[0],
      address: "555 Main Street",
      city: "Mumbai",
      district: "Mumbai City",
      state: "Maharashtra",
      pincode: "400020",
      occupation: "Business Owner",
      preferredContactMethod: "WHATSAPP" as const,
      consentToContact: true,
      donorStatus: "ACTIVE" as const,
      verificationStatus: "VERIFIED" as const,
    },
  ];

  const donorRecords = await db
    .insert(donors)
    .values(sampleDonors)
    .onConflictDoNothing()
    .returning();
  console.log(`   ✓ Created ${donorRecords.length} sample donors\n`);

  // Seed Sample Blood Requests (for development)
  console.log("🩸 Seeding sample blood requests...");
  const currentYear = new Date().getFullYear();
  const sampleRequests = [
    {
      referenceNumber: `BD-${currentYear}-000001`,
      requesterName: "Dr. Mehta",
      patientName: "Suresh Gupta",
      bloodGroupId: bloodGroupMap.get("A_POSITIVE")!,
      unitsRequired: 2,
      reason: "Surgery",
      hospitalName: "City Hospital",
      hospitalLocation: "MG Road, Mumbai",
      requiredDate: addDays(new Date(), 2).toISOString().split("T")[0],
      requiredTime: "10:00",
      contactPhone: "+919123456789",
      pocName: "Nurse Sharma",
      pocPhone: "+919123456790",
      urgency: "URGENT" as const,
      status: "PENDING" as const,
    },
    {
      referenceNumber: `BD-${currentYear}-000002`,
      requesterName: "Family Member",
      patientName: "Anjali Verma",
      bloodGroupId: bloodGroupMap.get("O_NEGATIVE")!,
      unitsRequired: 3,
      reason: "Accident Emergency",
      hospitalName: "Emergency Care Center",
      hospitalLocation: "Highway Road, Pune",
      requiredDate: new Date().toISOString().split("T")[0],
      requiredTime: "14:00",
      contactPhone: "+919234567890",
      alternativeContact: "+919234567891",
      urgency: "EMERGENCY" as const,
      status: "IN_PROGRESS" as const,
      internalNotes: "Contacted 3 donors. 2 confirmed.",
    },
    {
      referenceNumber: `BD-${currentYear}-000003`,
      requesterName: "Hospital Admin",
      patientName: "Ramesh Patel",
      bloodGroupId: bloodGroupMap.get("B_POSITIVE")!,
      unitsRequired: 1,
      reason: "Scheduled Transfusion",
      hospitalName: "General Hospital",
      hospitalLocation: "Station Road, Nagpur",
      requiredDate: addDays(new Date(), 7).toISOString().split("T")[0],
      contactPhone: "+919345678901",
      urgency: "NORMAL" as const,
      status: "CONTACTED" as const,
    },
  ];

  const requestRecords = await db
    .insert(bloodRequests)
    .values(sampleRequests)
    .onConflictDoNothing()
    .returning();
  console.log(`   ✓ Created ${requestRecords.length} sample blood requests\n`);

  // Seed Sample Notifications (for development - will be visible to all admins)
  console.log("🔔 Seeding sample notifications...");
  const sampleNotifications = [
    {
      type: "NEW_DONOR" as const,
      title: "New Donor Registration",
      message: "Sneha Reddy has registered as a new donor and is pending verification.",
      entityType: "donor",
      isRead: false,
    },
    {
      type: "URGENT_BLOOD_REQUEST" as const,
      title: "Urgent Blood Request",
      message: "Emergency blood request for O- blood at Emergency Care Center, Pune.",
      entityType: "blood_request",
      isRead: false,
    },
    {
      type: "NEW_BLOOD_REQUEST" as const,
      title: "New Blood Request",
      message: "New blood request received for A+ blood at City Hospital.",
      entityType: "blood_request",
      isRead: true,
    },
  ];

  const notificationRecords = await db
    .insert(notifications)
    .values(sampleNotifications)
    .onConflictDoNothing()
    .returning();
  console.log(`   ✓ Created ${notificationRecords.length} sample notifications\n`);

  console.log("✅ Database seed completed successfully!\n");
  console.log("📋 Summary:");
  console.log(`   - Blood Groups: ${allBloodGroups.length}`);
  console.log(`   - Settings: ${settingsRecords.length}`);
  console.log(`   - Content: ${contentRecords.length}`);
  console.log(`   - Donors: ${donorRecords.length}`);
  console.log(`   - Blood Requests: ${requestRecords.length}`);
  console.log(`   - Notifications: ${notificationRecords.length}`);
  console.log("\n⚠️  Note: This is development seed data. Do not use in production.\n");
  console.log("📝 Next steps:");
  console.log("   1. Create a Supabase Auth user for admin access");
  console.log("   2. Insert an admin_users record linking to the auth user");
  console.log("   3. See README.md for detailed instructions\n");

  await client.end();
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
